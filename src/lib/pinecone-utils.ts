import { Document } from '@langchain/core/documents';
import { PineconeStore } from '@langchain/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Resource } from 'sst';
import { constants } from './config';
import { openAIEmbeddings } from './embeddings-utils';
import { getDocsFromFile } from './loader-utils';

const { pineconeIndexName } = constants;

export const pineconeClient = new Pinecone({ apiKey: Resource.PineconeApiSecret.value });

export async function pineconeIndexDocs(
  docs: Document<Record<string, any>>[],
  client: Pinecone = pineconeClient,
  indexName = pineconeIndexName,
  namespace: string
) {
  try {
    // 1. Retrieve Pinecone index w namespace
    const pineconeIndex = client.Index(indexName);
    // 2. Log the retrieved index name
    console.log(`Pinecone index ${indexName}; namespace ${namespace}`);
    // 3. Create RecursiveCharacterTextSplitter instance
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 20
    });
    // 4. get splitted docs
    const splittedDocs = await textSplitter.splitDocuments(docs);
    // 5. embed docs and store in pinecone
    await PineconeStore.fromDocuments(splittedDocs, openAIEmbeddings(), {
      pineconeIndex,
      namespace
    });
  } catch (error) {
    console.error(error);
    throw new Error('Error indexing docs in pinecone');
  }
}

export async function embedDocFile(localPath: string, namespace: string) {
  try {
    const documents = await getDocsFromFile(localPath);
    await pineconeIndexDocs(documents, pineconeClient, pineconeIndexName, namespace);
    return {
      ok: true
    };
  } catch (error) {
    return {
      ok: false
    };
  }
}

export async function deleteByNamespace(namespace: string) {
  const client = pineconeClient;
  const index = client.Index(pineconeIndexName);
  try {
    await index.namespace(namespace).deleteAll();
  } catch (error) {
    console.error(error);
    throw new Error('Error deleting namespace');
  }
}
