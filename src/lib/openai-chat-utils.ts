import { Callbacks } from '@langchain/core/callbacks/manager';
import { ChatOpenAI } from '@langchain/openai';
import { Resource } from 'sst';

export const getOpenAIChatModel = ({
  temperature = 0,
  model = 'gpt-4o',
  callbacks
}: {
  temperature?: number;
  model?: string;
  callbacks?: Callbacks | undefined;
}) => {
  return new ChatOpenAI({
    model,
    temperature,
    openAIApiKey: Resource.OpenAIApiSecret.value,
    callbacks
  });
};
