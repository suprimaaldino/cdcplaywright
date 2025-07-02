import { test, expect } from '@playwright/test';
import { credentials } from '../../testData/testData';
import { LoginPage } from '../../pages/loginPage';
import { InventoryPage } from '../../pages/inventoryPage';
import { CartPage } from '../../pages/cartPage';
import { CheckoutPage } from '../../pages/checkoutPage';
import { checkoutInfo } from '../../testData/testData';

// Configuration for visual tests
const VISUAL_TEST_CONFIG = {
  threshold: 0.2,
  maxDiffPixels: 100,
  animations: 'disabled' as const,
};

test.describe(' Visual Regression Suite', () => {
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
    await loginPage.login(
      credentials.standardUser.username,
      credentials.standardUser.password
    );
  });

  test('loginPageVisualComparison', async ({ page }) => {
    await loginPage.goto();
    await expect(page).toHaveScreenshot('loginPage.png', {
      ...VISUAL_TEST_CONFIG,
      mask: [page.locator('.login_credentials_wrap')]
    });
  });

  test('inventoryPageVisualComparison', async ({ page }) => {
    await inventoryPage.verifyPageLoaded();
    await expect(page).toHaveScreenshot('inventoryPage.png', {
      ...VISUAL_TEST_CONFIG,
      fullPage: true,
      mask: [
        page.locator('.inventory_item_price'),
        page.locator('.shopping_cart_badge'),
      ],
    });
  });

  test('cartAndCheckoutFlowVisualComparison', async ({ page }) => {
    const testProduct = 'Sauce Labs Backpack';
    
    await inventoryPage.addProductToCart(testProduct);
    await inventoryPage.navigateToCart();
    await expect(page).toHaveScreenshot('cartPage.png', {
      ...VISUAL_TEST_CONFIG
    });

    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutInfo(
      checkoutInfo.firstName,
      checkoutInfo.lastName,
      checkoutInfo.validZipCode
    );
    await expect(page).toHaveScreenshot('checkoutPage.png', {
      ...VISUAL_TEST_CONFIG,
      mask: [page.locator('.summary_subtotal_label')]
    });
  });

  test('orderConfirmationVisualComparison', async ({ page }) => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.navigateToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutInfo(
      checkoutInfo.firstName,
      checkoutInfo.lastName,
      checkoutInfo.validZipCode
    );
    await checkoutPage.finishCheckout();

    await expect(checkoutPage.checkoutCompleteContainer).toBeVisible();
    await expect(page).toHaveScreenshot('orderConfirmation.png', {
      ...VISUAL_TEST_CONFIG,
      timeout: 5000
    });
  });
});