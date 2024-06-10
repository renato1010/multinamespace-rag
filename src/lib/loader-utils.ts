import 'pdfjs-dist';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { TextLoader } from 'langchain/document_loaders/fs/text';

function getFileExtension(fileName: string): string {
  const parts = fileName.split('.');

  const ext = parts.pop();
  if (!ext) {
    // No extension found
    throw new Error('No file extension found in the file path');
  }
  return ext;
}

export function getDocsFromFile(localPath: string) {
  const extLoaderMap = {
    pdf: PDFLoader,
    txt: TextLoader
  };
  const ext = getFileExtension(localPath) as 'pdf' | 'txt';
  const loader = new extLoaderMap[ext](localPath);
  return loader.load();
}
