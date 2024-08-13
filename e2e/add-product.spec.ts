import path from 'node:path';
import { test, expect } from '@playwright/test';
import prisma from '@/lib/db';
import slugify from 'slugify';
import { Pinecone } from '@pinecone-database/pinecone';
import { data } from './test-data/add-product-data.js';
import { constants } from '@/lib/config';
import { getSecretKeyByName } from '@/lib/secrets-utils.js';
import { deleteS3FolderAndContents } from './test-data/utils/s3-bucket.js';

const { pineconeIndexName, namespaceBucket } = constants;

const { productName, productDescription, docFilePath, imgFilePath } = data;
const slugified = slugify(productName).toLowerCase();
test.describe.configure({ mode: 'serial' });
test.describe('Add Product Page', () => {
  // hooks
  test.beforeEach(async ({ page }) => {
    await page.goto('/products/add');
  });
  test.afterAll('Deleting the newly created Product', async ({}) => {
    try {
      const pineconeSecret = await getSecretKeyByName('pinecone-api-key');
      if (!pineconeSecret) throw new Error('Pinecone secret not found');
      const pineconeClient = new Pinecone({ apiKey: pineconeSecret });
      const index = pineconeClient.Index(pineconeIndexName);

      // remove newly created product from DB by unique property slug
      const deletedProduct = await prisma.product.delete({ where: { slug: slugified } });
      console.log(`Product with name = ${deletedProduct.name} was removed successfuly`);
      // delete all vectors in Pinecone-Index with specific namespace
      await index.namespace(slugified).deleteAll();
      console.log(`Vectors with namespace ${slugified} were removed successfuly`);
      // delete product doc and img from S3 bucket
      await deleteS3FolderAndContents(namespaceBucket, `${slugified}/`);
      console.log(`${slugified}/doc and ${slugified}/img objects removed from bucket`);
    } catch (error) {
      console.error(error);
    }
  });
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

    // await for paragraph showing the uploaded doc url
    await expect(page.getByText(/new doc url/i)).toBeVisible({ timeout: 15000 });
    // go to products page and check for the presence of newly created product
    await page.goto('/products', { waitUntil: 'load' });
    // check for a product with a specific name
    await expect(page.getByRole('heading', { level: 3, name: productName })).toBeVisible({
      timeout: 15000
    });
  });
});
