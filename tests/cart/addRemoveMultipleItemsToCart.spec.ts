import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { InventoryPage } from '../../pages/inventoryPage';
import { CartPage } from '../../pages/cartPage';
import { credentials } from '../../testData/testData';

test.describe('cartManagementTests', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);

        await loginPage.goto();
        await loginPage.login(
            credentials.standardUser.username,
            credentials.standardUser.password
        );
        await inventoryPage.verifyPageLoaded();
    });

    test.describe('multipleItemsOperations', () => {
        const testProducts = [
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt'
        ];

        test.beforeEach(async () => {
            for (const product of testProducts) {
                await inventoryPage.addProductToCart(product);
            }
            await inventoryPage.verifyCartCount(testProducts.length);
        });

        test('verifyMultipleItemsInCart', async () => {
            await inventoryPage.navigateToCart();

            for (const product of testProducts) {
                await cartPage.verifyItemInCart(product);
            }
            await cartPage.verifyItemCount(testProducts.length);
        });

        test('removeSpecificItemsFromCart', async () => {
            const itemToRemove = 'Sauce Labs Bike Light';

            await inventoryPage.navigateToCart();
            await cartPage.removeItem(itemToRemove);

            const expectedCount = testProducts.length - 1;
            await cartPage.verifyItemCount(expectedCount);
            await cartPage.verifyItemNotInCart(itemToRemove);
        });

        test('addAndVerifyAllAvailableProducts', async () => {
            const initialProducts = await inventoryPage.getAllProductNames();
            expect(initialProducts.length).toBeGreaterThan(0);

            if (await inventoryPage.getCartCount() > 0) {
                await inventoryPage.navigateToCart();
                await cartPage.removeAllItems();
                await inventoryPage.goto();
            }

            for (const product of initialProducts) {
                await inventoryPage.addProductToCart(product);
            }

            await inventoryPage.verifyCartCount(initialProducts.length);

            await inventoryPage.navigateToCart();

            const cartItems = await cartPage.getAllItemNames();
            expect(cartItems.length).toBe(initialProducts.length);

            for (const product of initialProducts) {
                await cartPage.verifyItemInCart(product);
            }
        });
    });
});
