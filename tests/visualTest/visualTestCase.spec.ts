import { test, expect } from '@playwright/test';
import { credentials } from '../../testData/testData';
import { LoginPage } from '../../pages/loginPage';
import { InventoryPage } from '../../pages/inventoryPage';
import { CartPage } from '../../pages/cartPage';
import { CheckoutPage } from '../../pages/checkoutPage';
import { checkoutInfo } from '../../testData/testData';

test.describe('Visual regression for SauceDemo', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.standardUser.username, credentials.standardUser.password);
  });

  test('loginPageVisualRegression', async ({ page }, testInfo) => {
    await loginPage.goto();
    await expect(page).toHaveScreenshot(`loginPage${capitalize(testInfo.project.name)}.png`, {
      maxDiffPixels: 100,
      animations: 'disabled'
    });
  });

  test('inventoryPageVisualRegression', async ({ page }, testInfo) => {
    await inventoryPage.verifyPageLoaded();
    await expect(page).toHaveScreenshot(`inventoryPage${capitalize(testInfo.project.name)}.png`, {
      mask: [page.locator('.inventory_item_price')],
      fullPage: true
    });
  });

  test('cartCheckoutPageVisualRegression', async ({ page }, testInfo) => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.navigateToCart();
    await expect(page).toHaveScreenshot(`cartPage${capitalize(testInfo.project.name)}.png`);
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutInfo(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.validZipCode);
    await expect(checkoutPage.summaryTitle).toBeVisible();
    await expect(page).toHaveScreenshot(`checkoutPage${capitalize(testInfo.project.name)}.png`);
  });

  test('orderConfirmationPageVisualRegression', async ({ page }, testInfo) => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.navigateToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutInfo(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.validZipCode);
    await checkoutPage.finishCheckout();

    await expect(checkoutPage.checkoutCompleteContainer).toBeVisible();
    await expect(page).toHaveScreenshot(`orderConfirmation${capitalize(testInfo.project.name)}.png`, {
      timeout: 5000
    });
  });
});

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
