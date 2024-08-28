/**
 * v0 by Vercel.
 * @see https://v0.dev/t/AEtNr93RGu5
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import prisma from '@/lib/db';
import { Product } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Products',
  description: 'Products page'
};

export default async function ProductListPage() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, description: true, imgUrl: true, slug: true }
  });

  return (
    <section className="h-screen w-screen flex flex-col justify-start items-center">
      <h2 className="text-2xl font-bold my-8">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 md:px-6 py-8">
        {products.map(ProductCard)}
      </div>
    </section>
  );
}

function ProductCard({
  description,
  id,
  slug,
  name,
  imgUrl
}: Pick<Product, 'id' | 'name' | 'description' | 'imgUrl' | 'slug'>) {
  return (
    <div
      key={id}
      className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-950 border border-slate-200"
    >
      <Image
        src={imgUrl}
        alt={`product image for ${name}`}
        width={721}
        height={541}
        className="w-full h-60 object-scale-down object-center"
        priority
      />
      <div className="h-[350px] flex flex-col p-4 text-center">
        <h3 className="text-lg font-semibold mb-2">
          {name}
        </h3>
        <p className="flex-1 text-gray-500 dark:text-gray-400 mb-2 overflow-hidden">
          {description}
        </p>
        <div className="flex flex-col gap-y-4 justify-between items-center">
          <div className="text-sm md:text-[11px] text-primary font-semibold bg-slate-200">
            <code className="font-mono font-bold">Namespace: {slug}</code>
          </div>
          <Link
            href={`/products/${slug}`}
            className="bg-primary text-center text-white px-4 py-2 rounded-md"
          >
            Go to product chat
          </Link>
        </div>
      </div>
    </div>
  );
}
