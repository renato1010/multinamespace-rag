/**
 * v0 by Vercel.
 * @see https://v0.dev/t/mxB6jSLk18k
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export function UploadDocFileForm() {
  return (
    <div className="mx-auto max-w-md space-y-6 py-12 px-4 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">File Submission</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Upload a file to the server using the new Next.js 13 server actions feature.
        </p>
      </div>
      <form action="/api/upload" method="POST" encType="multipart/form-data" className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" name="name" type="text" required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="product-pitch">
            Product Pitch
            <span className="inline-block align-baseline text-[0.5rem]">(description)</span>
          </Label>
          <Textarea id="product-pitch" name="name" required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="file">File</Label>
          <Input id="file" name="file" type="file" accept=".txt, .pdf" required />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
