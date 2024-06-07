export async function putObjectToPresignedUrl(presignedUrl: string, fileType: string, file: File) {
  const doc = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': fileType,
      'Content-Disposition': `attachment; filename="${file.name}"`
    }
  });
  return doc
}
