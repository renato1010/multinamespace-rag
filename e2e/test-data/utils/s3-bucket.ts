import { DeleteObjectsCommand, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client();

export async function deleteS3FolderAndContents(bucketName: string, folderPath: string) {
  const listObjectsCommand = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: folderPath,
  });

  const listResponse = await s3Client.send(listObjectsCommand);

  if (!listResponse.Contents) {
    console.log(`No objects found in folder ${folderPath}`);
    return;
  }

  const objectKeys = listResponse.Contents.map((obj) => ({ Key: obj.Key }));

  const deleteObjectsCommand = new DeleteObjectsCommand({
    Bucket: bucketName,
    Delete: {
      Objects: objectKeys,
    },
  });

  try {
    const deleteResponse = await s3Client.send(deleteObjectsCommand);
    console.log(`Successfully deleted ${deleteResponse.Deleted?.length} objects from folder ${folderPath}`);
  } catch (err) {
    console.error('Error deleting objects:', err);
  }
}
