/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'multinamespace-rag',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws'
    };
  },
  async run() {
    const openAIApiSecret = new sst.Secret('OpenAIApiSecret');
    const pineconeApiSecret = new sst.Secret('PineconeApiSecret');
    const namespaceBucket = new sst.aws.Bucket('NamespaceDocs', {
      public: true
    });
    new sst.aws.Nextjs('MultiNamespaceRag', {
      link: [namespaceBucket, openAIApiSecret, pineconeApiSecret]
    });
  }
});
