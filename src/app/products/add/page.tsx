import { UploadDocFileForm } from '@/components/doc-upload-form';

export default async function AddProductPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploadDocFileForm />
    </main>
  );
}
