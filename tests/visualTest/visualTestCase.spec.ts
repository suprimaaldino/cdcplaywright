import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com/';

test.describe('Visual regression for SauceDemo', () => {
  test('Login page', async ({ page }, testInfo) => {
    await page.goto(BASE_URL);
    await expect(page.locator('[data-test="username"]')).toBeVisible();
    const screenshotName = `login-page-${testInfo.project.name}.png`;
    await expect(page).toHaveScreenshot(screenshotName);
  });

  test('Inventory page', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
    await expect(page).toHaveURL(/inventory/);
    await expect(page).toHaveScreenshot(`inventory-page-${test.info().project.name}.png`);
    await expect(page).toHaveScreenshot('inventory-page.png');
  });

  test('Cart page', async ({ page }, testInfo) => {
    await page.goto(BASE_URL);
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
    await page.click('.shopping_cart_link');
    await expect(page).toHaveURL(/cart/);
    await expect(page.locator('.cart_contents_container')).toBeVisible();
    const screenshotName = `cart-page-${testInfo.project.name}.png`;
    await expect(page).toHaveScreenshot(screenshotName);
  });

  test('Checkout page', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
    await page.click('.shopping_cart_link');
    await page.click('[data-test="checkout"]');
    await expect(page.locator('.checkout_info')).toBeVisible();
    await expect(page).toHaveScreenshot(`checkout-page-${test.info().project.name}.png`);
    await expect(page).toHaveScreenshot('checkout-page.png');
  });
});

// Optional: log info if baseline is being created in a robust way
test.afterEach(async ({}, testInfo) => {
  if (
    testInfo.status === 'failed' &&
    testInfo.attachments.some(
      (a) =>
        a.name?.toLowerCase().includes('screenshot') &&
        a.contentType === 'image/png'
    )
  ) {
    console.log('Baseline screenshot created. This is likely the first run.');
  }
});