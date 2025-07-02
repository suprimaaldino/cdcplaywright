import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com/';

test.describe('Visual regression for SauceDemo', () => {
  test('Login page', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('[data-test="username"]')).toBeVisible();
    await expect(page).toHaveScreenshot('login-page.png');
  });

  test('Inventory page', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('.inventory_list')).toBeVisible();
    await expect(page).toHaveScreenshot('inventory-page.png');
  });

  test('Cart page', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
    await page.click('.shopping_cart_link');
    await expect(page).toHaveURL(/cart/);
    await expect(page.locator('.cart_contents_container')).toBeVisible();
    await expect(page).toHaveScreenshot('cart-page.png');
  });

  test('Checkout page', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
    await page.click('.shopping_cart_link');
    await page.click('[data-test="checkout"]');
    await expect(page).toHaveURL(/checkout-step-one/);
    await expect(page.locator('.checkout_info')).toBeVisible();
    await expect(page).toHaveScreenshot('checkout-page.png');
  });
});

// Optional: log info if baseline is being created
test.afterEach(async ({}, testInfo) => {
  if (testInfo.status === 'failed' && testInfo.error?.message?.includes('expected to match a screenshot')) {
    console.log('Baseline screenshot created. This is likely the first run.');
  }
});