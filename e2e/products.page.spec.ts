import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/products');
});
test.describe('Products Page', () => {
  test('has title', async ({ page }) => {
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/products/i);
  });
  test('has header', async ({ page }) => {
    // Expect a heading to contain a substring.
    await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
  });
  test('has the same amount of images,product names headings and goto buttons', async ({
    page
  }) => {
    const images = await page.getByRole('img').count();
    const productNames = await page.getByRole('heading', { level: 3 }).count();
    const gotoButtons = await page.getByRole('link', { name: 'Go to product chat' }).count();
    const isBalanced = [images, productNames, gotoButtons].every((count) => count === images);
    expect(isBalanced).toEqual(true);
  });
});
