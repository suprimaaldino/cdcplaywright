import { test } from '@playwright/test';
import { InventoryPage } from '../../pages/inventoryPage';
import { loginStandardUser } from '../../login/loginStandardUser';

test.beforeEach(async ({ page }) => {
   await loginStandardUser(page);
});

test('itmAdd: Add T-Shirt and Fleece Jacket to cart', async ({ page }) => {
  // Inventory page assumes user is already logged in via beforeEach
  const inventoryPage = new InventoryPage(page);

  // Add selected items to cart
  await inventoryPage.addItem('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]');
  await inventoryPage.addItem('[data-test="add-to-cart-sauce-labs-fleece-jacket"]');

  // Verify the cart badge displays correct number of items
  await inventoryPage.verifyCartCount('2');
});