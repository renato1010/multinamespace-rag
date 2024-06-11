'use client';
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/mxB6jSLk18k
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createProduct } from '@/lib/actions/product';
import { cn } from '@/lib/utils';
import { useFormState } from 'react-dom';
import { CopyToClipboard } from './copy-to-clipboard-btn';
import { SubmitButton } from './submit-button';
import { Button } from './ui/button';

const initialState = {
  errors: {}
};
export function UploadDocFileForm() {
  const [uploadState, uploadFormAction] = useFormState(createProduct, initialState);

  return (
    <div className="mx-auto max-w-md space-y-6 py-12 px-4 sm:px-6 lg:px-8 border-2 border-slate-300">
      <div className="flex flex-col items-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Create Product</h2>
        <p className="text-gray-500 dark:text-gray-400">Upload product data</p>
        <div
          className={cn(
            'text-red-400 dark:text-pink-700 h-12',
            uploadState?.errors ? 'block' : 'hidden'
          )}
        >
          {Object.values(uploadState?.errors ?? {}).join(' | ')}
        </div>
        <div
          className={cn(
            'text-black text-xs h-24 w-full',
            uploadState?.documentUrl && uploadState?.imageUrl ? 'block' : 'hidden'
          )}
        >
          <p className="truncate">
            New doc url: {uploadState?.documentUrl}
          </p>
          <CopyToClipboard text={uploadState?.documentUrl ?? ''} />
          <br />
          <p className="truncate">
            New img url: {uploadState?.imageUrl}
          </p>
          <CopyToClipboard text={uploadState?.imageUrl ?? ''} />
        </div>
      </div>
      <form action={uploadFormAction} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" name="name" type="text" placeholder="awesome product" required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="product-pitch">
            Product Pitch
            <span className="inline-block align-baseline text-[0.5rem]">(description)</span>
          </Label>
          <Textarea
            id="product-pitch"
            name="description"
            placeholder="value proposal of the product"
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="docFile">Document File</Label>
          <Input
            id="docFile"
            name="docFile"
            type="file"
            placeholder="add .txt or .pdf file"
            accept=".txt, .pdf"
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="imgFile">Image File</Label>
          <Input
            id="imgFile"
            name="imgFile"
            type="file"
            placeholder="add .png or .jpg file"
            accept=".png,.jpg,.jpeg"
            required
          />
        </div>
        <div className="flex justify-around">
          <SubmitButton />
          <Button type="reset">Reset</Button>
        </div>
      </form>
    </div>
  );
}
