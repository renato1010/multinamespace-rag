import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Link className={buttonVariants({ variant: 'link' })} href="/products">
        Go to Products Page
      </Link>
    </main>
  );
}
