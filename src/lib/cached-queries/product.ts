import prisma from '@/lib/db';
import { type Product } from '@prisma/client';
import { unstable_cache } from 'next/cache';

export type ProductSelect<T = Product> = { [P in keyof T]?: boolean };

export const getProduct = unstable_cache(
  async (slug: string, select: ProductSelect) =>
    prisma.product.findUnique({
      where: { slug },
      select
    }),
  undefined,
  { tags: ['product'], revalidate: 60 * 60 }
);
