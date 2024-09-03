import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Resource } from 'sst';

export async function putObjectToPresignedUrl(presignedUrl: string, fileType: string, file: File) {
  const doc = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': fileType,
      'Content-Disposition': `attachment; filename="${file.name}"`
    }
  });
  return doc;
}
// use slug as bucket folder key
function getUploadCommand(folderKey: string) {
  return new PutObjectCommand({
    Bucket: Resource.NamespaceDocs.name,
    Key: folderKey
  });
}
export async function putDocAndImgtoPresignedUrl(slug: string, docFile: File, imgFile: File) {
  const docUploadCmd = getUploadCommand(`${slug}/doc`);
  const imgUploadCmd = getUploadCommand(`${slug}/img`);
  const getSplittedUrl = (url: string) => url.split('?')[0];
  try {
    const [docSignedUrl, imgSignedUrl] = await Promise.all([
      getSignedUrl(new S3Client({}), docUploadCmd),
      getSignedUrl(new S3Client({}), imgUploadCmd)
    ]);
    const [{ ok: docOK, url: docUrl }, { ok: imgOK, url: imgUrl }] = await Promise.all([
      putObjectToPresignedUrl(docSignedUrl, docFile.type, docFile),
      putObjectToPresignedUrl(imgSignedUrl, imgFile.type, imgFile)
    ]);
    return { docOK, docUrl: getSplittedUrl(docUrl), imgOK, imgUrl: getSplittedUrl(imgUrl) };
  } catch (error) {
    console.error(error);
    return { docOK: false, docUrl: '', imgOK: false, imgUrl: '' };
  }
}
