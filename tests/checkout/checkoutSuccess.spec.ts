import { test } from '@playwright/test';
import { CheckoutPage } from '../../pages/checkoutPage';
import { InventoryPage } from '../../pages/inventoryPage';
import { CartPage } from '../../pages/cartPage';
import { checkoutInfo, credentials } from '../../testData/testData';
import { LoginPage } from '../../pages/loginPage';

test.describe('checkoutWithMultipleItems @reg', () => {
    const testProducts = [
        'Sauce Labs Backpack',
        'Sauce Labs Bike Light',
        'Sauce Labs Bolt T-Shirt'
    ];

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
        await inventoryPage.verifyPageLoaded();
    }
);

    test('completeCheckoutFlow', async ({ page }) => {

        for (const product of testProducts) {
            await inventoryPage.addProductToCart(product);
        }
        await inventoryPage.verifyCartCount(testProducts.length);

        await inventoryPage.navigateToCart();
        for (const product of testProducts) {
            await cartPage.verifyItemInCart(product);
        }
        await cartPage.verifyItemCount(testProducts.length);
        
        await cartPage.proceedToCheckout();
        await checkoutPage.fillCheckoutInfo(
            checkoutInfo.firstName,
            checkoutInfo.lastName,
            checkoutInfo.validZipCode
        );
        await checkoutPage.expectSummaryVisible();
        await checkoutPage.finishCheckout();
        await checkoutPage.expectOrderComplete();
    });
});

