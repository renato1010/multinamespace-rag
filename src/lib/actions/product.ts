'use server';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import slugify from 'slugify';
import { clearTempFolder, saveFileToTempFolder } from '../fs-utils';
import { embedDocFile } from '../pinecone-utils';
import { putDocAndImgtoPresignedUrl } from '../s3-bucket-utils';
import { createProductSchema } from '../schema-validation-utils';

export async function createProduct(_prevSate: any, formData: FormData) {
  const formDataObj = Object.fromEntries(formData.entries());
  // slugify product name
  const slugified = slugify(formDataObj['name'] as string).toLowerCase();
  // parse schema
  const validatedFields = createProductSchema.safeParse({ ...formDataObj, slug: slugified });
  if (!validatedFields.success) {
    // no need to return slug error
    const { slug, ...restErrors } = validatedFields.error.flatten().fieldErrors;
    return { errors: restErrors };
  }
  // MIME type(doc file upload)
  const docMimeType = validatedFields.data.docFile.type;
  // MIME type(img file upload)
  const imgMimeType = validatedFields.data.imgFile.type;
  // save doc file to local fs
  const localFilePath = await saveFileToTempFolder(validatedFields.data.docFile);
  const { docFile, imgFile, slug: slugAsKey, ...stringProps } = validatedFields.data;
  try {
    // upload doc and img to S3
    const { docOK, docUrl, imgOK, imgUrl } = await putDocAndImgtoPresignedUrl(
      slugAsKey,
      docFile,
      imgFile
    );
    if (!docOK || !imgOK) return { errors: { file: 'Error uploading files' } };
    const {
      name,
      slug,
      docUrl: documentUrl,
      imgUrl: imageUrl
    } = await prisma.product.create({
      data: {
        ...stringProps,
        slug: slugAsKey,
        docMimeType,
        imgMimeType,
        docUrl,
        imgUrl
      }
    });
    // embed the doc file in pinecone
    const { ok: embeddingWentOK } = await embedDocFile(localFilePath, slug);
    if (!embeddingWentOK) return { errors: { file: 'Error embedding document file' } };
    return {
      message: `product: ${name} was created successfully`,
      documentUrl,
      imageUrl
    };
  } catch (error) {
    console.error(error);
    return { errors: { file: 'Error processing file' } };
  } finally {
    // remove file from local fs
    await clearTempFolder();
  }
  revalidatePath('/products');
  redirect('/products');
}
