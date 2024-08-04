/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    "MultiNamespaceRag": {
      "type": "sst.aws.Nextjs"
      "url": string
    }
    "NamespaceDocs": {
      "name": string
      "type": "sst.aws.Bucket"
    }
    "OpenAIApiSecret": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "PineconeApiSecret": {
      "type": "sst.sst.Secret"
      "value": string
    }
  }
}
export {}
