import path from 'node:path';
import { test, expect } from '@playwright/test';
// import prisma from '@/lib/db';
// import { deleteByNamespace } from '@/lib/pinecone-utils';
// import slugify from 'slugify';
import { data } from './test-data/add-product-data';
const { productName, productDescription, docFilePath, imgFilePath } = data;

test.beforeEach(async ({ page }) => {
  await page.goto('/products/add');
});

// test.afterAll(async ({}) => {
//   const { deleteByNamespace } = await import('../src/lib/pinecone-utils');
//   const { default: slugify } = await import('slugify');
//   const { productName } = await import('./test-data/add-product-data.json');

//   // remove newly created product from DB by unique property slug
//   const slugified = slugify(productName).toLowerCase();
//   const deletedProduct = await prisma.product.delete({ where: { slug: slugified } });
//   console.log(`Product with name = ${deletedProduct.name} was removed successfuly`);
//   // delete all vectors in Pinecone-Index with specific namespace
//   await deleteByNamespace(slugified);
// });

test.describe('Add Product Page', () => {
  test('has title', async ({ page }) => {
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/add product/i);
  });
  test('has header', async ({ page }) => {
    // Expect a heading to contain a substring.
    await expect(page.getByRole('heading', { level: 2, name: /create product/i })).toBeVisible();
  });
  test('Create new product', async ({ page }) => {
    // fill the name input
    await page.getByPlaceholder(/awesome product/i).fill(productName);
    // fill de description input
    await page.getByPlaceholder(/value proposal of the product/i).fill(productDescription);
    // set the document file
    await page.locator("input[name='docFile']").setInputFiles(path.join(__dirname, docFilePath));
    // set the img file
    await page.locator("input[name='imgFile']").setInputFiles(path.join(__dirname, imgFilePath));
    await page.getByRole('button', { name: /submit/i }).click();
    await page.pause();
    // await for paragraph showing the uploaded doc url
    await expect(page.getByText(/new doc url/i)).toBeVisible({ timeout: 10000 });

    // go to products page and check for the presence of newly created product
    await page.goto('/products');
    // check for a product with a specific name and description
    await expect(page.getByText(productName)).toBeVisible();
    await expect(page.getByText(productDescription)).toBeVisible();
  });
});
