import { z } from 'zod';

const slugRegex = /^[a-zA-Z0-9-]+$/;
const nameRegex = /^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/;

const slugValidator = (slug: string) => slugRegex.test(slug);
const nameValidator = (name: string) => nameRegex.test(name.trim());
const ACCEPTED_DOC_FILE_TYPES = ['text/plain', 'application/pdf'];
const ACCEPTED_IMAGE_FILE_TYPES = ['image/png', 'image/jpeg'];

export const createProductSchema = z.object({
  slug: z.string().refine(slugValidator, { message: 'Invalid text for slug property' }),
  name: z.string().min(1).refine(nameValidator, { message: 'Invalid text for name property' }),
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(160, { message: 'Description maximum length is 160 chars' }),
  docFile: z
    .instanceof(File)
    .refine((file) => ACCEPTED_DOC_FILE_TYPES.includes(file?.type), {
      message: 'Invalid doc file type'
    })
    .refine((file) => file?.size <= 1024 * 1024 * 5, {
      message: 'File size must be less than 5MB'
    }),
  imgFile: z
    .instanceof(File)
    .refine((file) => ACCEPTED_IMAGE_FILE_TYPES.includes(file?.type), {
      message: 'Invalid img file type'
    })
    .refine((file) => file?.size <= 1024 * 1024 * 5, {
      message: 'File size must be less than 5MB'
    })
});
