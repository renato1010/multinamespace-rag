import { constants } from '@/lib/config';
import { openAIEmbeddings } from '@/lib/embeddings-utils';
import { getOpenAIChatModel } from '@/lib/openai-chat-utils';
import { pineconeClient as pcClient } from '@/lib/pinecone-utils';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { PineconeStore } from '@langchain/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';
import { LangChainAdapter, StreamingTextResponse, type Message } from 'ai';
import { formatDocumentsAsString } from 'langchain/util/document';
import { NextResponse } from 'next/server';

export const maxDuration = 30;

type ChatRequest = Request & { body: { messages: Message[]; slug: string } };
export async function POST(req: ChatRequest) {
  const { messages, slug } = await (req.json() as Promise<ChatRequest['body']>);
  const lastMessageContent = messages[messages.length - 1].content;
  if (!lastMessageContent || !slug) {
    throw new Error(`Missing essential data in the chat request body`);
  }
  try {
    const stream = await askDocs(lastMessageContent, pcClient, slug);
    const aiStream = LangChainAdapter.toAIStream(stream);
    return new StreamingTextResponse(aiStream);
  } catch (error) {
    console.error(error);
    return new NextResponse('error: Internal server error', { status: 500 });
  }
}

async function askDocs(prompt: string, pineconeClient: Pinecone = pcClient, namespace: string) {
  const indexName = constants.pineconeIndexName;
  const openAIChatModel = getOpenAIChatModel({ temperature: 0.2 });

  const pineconeIndex = pineconeClient.Index(indexName);
  const vectorStore = await PineconeStore.fromExistingIndex(openAIEmbeddings(), {
    pineconeIndex,
    namespace
  });
  const vectorStoreRetriever = vectorStore.asRetriever();
  const retrieverDocs = await vectorStoreRetriever.invoke(prompt);
  const chatPromptTemplate = PromptTemplate.fromTemplate(`
As a sales expert, respond to the question based solely on the following context. 
Highlight the benefits and advantages of the referenced item. 
In case the provided documentation lacks sufficient information 
to respond the question politely invite user to reach customer support.
{documentation}
Question: {question}
  `);
  const outputParser = new StringOutputParser();
  const ragChain = chatPromptTemplate.pipe(openAIChatModel).pipe(outputParser);
  const stream = await ragChain.stream({
    documentation: formatDocumentsAsString(retrieverDocs),
    question: prompt
  });
  return stream;
}
