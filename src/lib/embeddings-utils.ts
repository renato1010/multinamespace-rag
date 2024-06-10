import { Resource } from 'sst';
import { OpenAIEmbeddings } from '@langchain/openai';
import { constants } from './config';

export function openAIEmbeddings(
  batchSize = 512,
  openaiEmbeddingsModel = constants.embeddingModel
) {
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: Resource.OpenAIApiSecret.value,
    model: openaiEmbeddingsModel,
    batchSize: batchSize
  });
  return embeddings;
}
