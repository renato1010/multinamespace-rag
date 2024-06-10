import { Resource } from 'sst';

export default function Home() {
  console.log('openaisecret: ', Resource.OpenAIApiSecret.value);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>Products</p>
    </main>
  );
}
