This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). But using [SST](https://ion.sst.dev/docs/) as deployment engine.

## Next.js with AWS as infrastructure provider using SST and [OpenNext](https://open-next.js.org/)

Before start:

1. Configure AWS Credentials
   with `unix`

   ```bash
   $ cat ~/.aws/credentials

   [default]
    aws_access_key_id=XXXXXXXXXXXXXXXXXXXXX
    aws_secret_access_key=XXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

2. Install the [SST CLI](https://ion.sst.dev/docs/reference/cli)  
   The CLI helps you manage your SST apps.
   ```bash
   curl -fsSL https://ion.sst.dev/install | bash
   ```

### Create the project

Create the app:

```bash
npm create-next-app@latest multinamespace-rag
pnpm dlx create-next-app@latest multinamespace-rag
cd multinamespace-rag
```

Check: [SST/Next.js](https://ion.sst.dev/docs/start/aws/nextjs/)

### Init SST(infrastructure)

```bash
sst init
```

This will create file `sst.config.ts` at root, and wraps your dev script as "sst dev next dev"  
To run your app in dev mode run `pnpm dev` that executes under the hood `sst dev next dev`

### App Secrets

In this project we didn't use `.env.*` files.  
we'll use a couple of secret API keys but will set those values as `sst.Secret` [component](https://ion.sst.dev/docs/component/secret/)

- Secret are encrypted when they are stored in your state file or in a function package.
  Secrets are encrypted and stored in an S3 bucket in your AWS account. If used in your app config, they’ll be encrypted in your state file as well. If used in your function code, they’ll be decrypted and stored in the function package.

**Create a secret**:  
At `sst.config.ts`

```bash
const secret = new sst.Secret("MySecret");
```

We created two, one for OpenAI and other for PineCone api keys
[`sst.config`](./sst.config.ts)

```bash
...
async run() {
   const openAIApiSecret = new sst.Secret('OpenAIApiSecret');
   const pineconeApiSecret = new sst.Secret('PineconeApiSecret');
...
```

To set the values for secrets you just run CLI cmd

```bash
sst secret set MySecret my-secret-value
```

Then to use in code the secret just call it as member of `Resource` object  
e.g at: [`src/lib/embeddings-utils.ts`](src/lib/embeddings-utils.ts)

```typescript
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
```
