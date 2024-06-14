import { basicProductSelect } from '@/app/products/[slug]/page';
import { getProduct } from '@/lib/cached-queries/product';
import Image from 'next/image';

export default async function Header({ slug }: { slug: string }) {
  const basicProduct = await getProduct(slug, basicProductSelect);
  if (!basicProduct) throw new Error('Product not found');
  const { name, description, imgUrl } = basicProduct;

  return (
    <div className="z-10 flex flex-col max-w-5xl w-full items-center justify-start font-mono text-sm">
      <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-950 border border-slate-200 flex flex-col justify-start items-center">
        <Image
          src={imgUrl}
          alt={`product image for ${name}`}
          width={180}
          height={135}
          className="w-full object-scale-down object-center mb-4"
          priority
        />
        <h3 className="text-md font-semibold mb-2">{name}</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-2">{description}</p>
      </div>
    </div>
  );
}
