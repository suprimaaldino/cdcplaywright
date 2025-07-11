import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { InventoryPage } from '../../pages/inventoryPage';
import { CartPage } from '../../pages/cartPage';
import { credentials } from '../../testData/testData';

test.describe('cartManagementTests @reg', () => {
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

    test.describe('singleItemOperations @reg', () => {
        const testProduct = 'Sauce Labs Backpack';

        test('addAndVerifySingleItemInCart', async () => {
            await inventoryPage.addProductToCart(testProduct);
            await inventoryPage.verifyCartCount(1);

            await inventoryPage.navigateToCart();
            await cartPage.verifyPageLoaded();
            await cartPage.verifyItemInCart(testProduct);
        });

        test('addThenRemoveSingleItemFromCart', async () => {
            await inventoryPage.addProductToCart(testProduct);
            await inventoryPage.removeProductFromCart(testProduct);

            await inventoryPage.verifyCartCount(0);
            await inventoryPage.navigateToCart();
            expect(await cartPage.isCartEmpty()).toBeTruthy();
        });
    });
});

test.afterEach(async ({ page }, testInfo) => {
    console.log(`Finished ${testInfo.title} with status ${testInfo.status}`);

    if (testInfo.status !== testInfo.expectedStatus) {
        console.log(`Did not run as expected, ended up at ${page.url()}`);
    }
});

test.afterAll(async () => {
    console.log('All addRemoveItemToCart tests have completed.');
});