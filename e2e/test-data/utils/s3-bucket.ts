import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client();

export async function deleteS3Folder(bucketName: string, folderPath: string) {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: folderPath.endsWith('/') ? folderPath : `${folderPath}/`
  });

  try {
    const response = await s3Client.send(command);
    console.log(`Successfully deleted object ${folderPath} from bucket ${bucketName}`);
    return response;
  } catch (err) {
    console.error(`Error deleting object ${folderPath} from bucket ${bucketName}:`, err);
    throw err;
  }
}
