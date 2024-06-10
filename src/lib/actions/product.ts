'use server';
import { Resource } from 'sst';
import prisma from '@/lib/db';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import slugify from 'slugify';
import { z } from 'zod';
import { putObjectToPresignedUrl } from '../s3-bucket-utils';
import { embedDocFile } from '../pinecone-utils';
import { clearTempFolder, saveFileToTempFolder } from '../fs-utils';

const slugRegex = /^[a-zA-Z0-9-]+$/;
const nameRegex = /^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/;

const slugValidator = (slug: string) => slugRegex.test(slug);
const nameValidator = (name: string) => nameRegex.test(name.trim());
const ACCEPTED_FILE_TYPES = ['text/plain', 'application/pdf'];

const createProductSchema = z.object({
  slug: z.string().refine(slugValidator, { message: 'Invalid text for slug property' }),
  name: z.string().min(1).refine(nameValidator, { message: 'Invalid text for name property' }),
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(160, { message: 'Description maximum length is 160 chars' }),
  file: z
    .instanceof(File)
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file?.type), { message: 'Invalid file type' })
    .refine((file) => file?.size <= 1024 * 1024 * 5, { message: 'File size must be less than 5MB' })
});

export async function createProduct(_prevSate: any, formData: FormData) {
  const formDataObj = Object.fromEntries(formData.entries());
  // slugify product name
  const slugified = slugify(formDataObj['name'] as string);
  // parse schema
  const validatedFields = createProductSchema.safeParse({ ...formDataObj, slug: slugified });
  if (!validatedFields.success) {
    // no need to return slug error
    const { slug, ...restErrors } = validatedFields.error.flatten().fieldErrors;
    return { errors: restErrors };
  }
  // MIME type(file upload)
  const mimeType = validatedFields.data.file.type;
  // save file to local fs
  const localFilePath = await saveFileToTempFolder(validatedFields.data.file);

  // upload file to S3
  const uploadCommand = new PutObjectCommand({
    Bucket: Resource.NamespaceDocs.name,
    Key: validatedFields.data.slug
  });
  try {
    // get a presigned url to upload doc file
    const presignedUrl = await getSignedUrl(new S3Client({}), uploadCommand);
    // upload file to S3
    const { ok, url } = await putObjectToPresignedUrl(
      presignedUrl,
      validatedFields.data.file.type,
      validatedFields.data.file
    );
    if (!ok) return { errors: { file: 'Error uploading file' } };
    // create product in db
    // get the bucket/object-key as url reference
    const docsFolderUrl = url.split('?')[0];
    const { file, ...stringProps } = validatedFields.data;
    const {
      name,
      slug,
      docsFolderUrl: uploadedDocUrl
    } = await prisma.product.create({
      data: {
        ...stringProps,
        mimeType,
        docsFolderUrl
      }
    });
    // embed the doc file in pinecone
    const { ok: embeddingWentOK } = await embedDocFile(localFilePath, slug);
    if (!embeddingWentOK) return { errors: { file: 'Error embedding document file' } };

    return {
      message: `product: ${name} was created successfully`,
      uploadedDocUrl
    };
  } catch (error) {
    console.error(error);
    return { errors: { file: 'Error processing file' } };
  } finally {
    // remove file from local fs
    await clearTempFolder();
  }
}
