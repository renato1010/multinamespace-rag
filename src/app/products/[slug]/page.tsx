import { ChatSection } from '@/components/chat-section';
import Header from '@/components/header';
import { getProduct, type ProductSelect } from '@/lib/cached-queries/product';
import { redirect } from 'next/navigation';

export const basicProductSelect: ProductSelect = {
  name: true,
  description: true,
  imgUrl: true
};

export default async function ProductChatPage({ params: { slug } }: { params: { slug: string } }) {
  if (!slug) {
    redirect('/products');
  }

  const basicProduct = await getProduct(slug, basicProductSelect);
  if (!basicProduct) throw new Error('Product not found');
  const { name, description, imgUrl } = basicProduct;

  return (
    <main className="h-full w-full flex justify-center items-center background-gradient">
      <div className="space-y-2 lg:space-y-10 w-[90%] lg:w-[60rem]">
        <Header slug={slug} />
        <div className="h-[65vh] flex">
          <ChatSection />
        </div>
      </div>
    </main>
  );
}
