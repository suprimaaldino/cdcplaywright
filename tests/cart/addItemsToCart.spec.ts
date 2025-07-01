import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { InventoryPage } from '../../pages/inventoryPage';
import { CartPage } from '../../pages/cartPage';
import { credentials } from '../../testData/testData';

test.describe('addSingleItemToCart', () => {
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

    test('addSauceLabsBackpackToCartAndVerify', async () => {
        const productName = 'Sauce Labs Backpack';

        await inventoryPage.addProductToCart(productName);
        await inventoryPage.verifyCartCount(1);

        await inventoryPage.navigateToCart();
        await cartPage.verifyPageLoaded();

        await cartPage.verifyItemInCart(productName);
        await cartPage.verifyItemCount(1);
        await cartPage.verifyCartBadgeCount(1);
    });

    test('addAndRemoveSauceLabsBackpackFromCart', async () => {
        const productName = 'Sauce Labs Backpack';

        await inventoryPage.addProductToCart(productName);
        await inventoryPage.verifyCartCount(1);

        await inventoryPage.removeProductFromCart(productName);
        await inventoryPage.verifyCartCount(0);

        await inventoryPage.navigateToCart();
        await cartPage.verifyItemNotInCart(productName);
        expect(await cartPage.isCartEmpty()).toBeTruthy();
    });
});
