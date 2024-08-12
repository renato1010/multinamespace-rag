import {
  SecretsManagerClient,
  GetSecretValueCommand,
  type GetSecretValueCommandInput
} from '@aws-sdk/client-secrets-manager';

const REGION = 'us-east-2';
const client = new SecretsManagerClient({ region: REGION });

export const getSecretKeyByName = async (secretName: string) => {
  const params: GetSecretValueCommandInput = {
    SecretId: secretName
  };
  const command = new GetSecretValueCommand(params);
  try {
    const response = await client.send(command);
    return response.SecretString;
  } catch (error) {
    throw new Error(`Error retrieving secret ${secretName}: ${error}`);
  }
};
