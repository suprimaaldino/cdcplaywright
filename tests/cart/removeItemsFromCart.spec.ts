import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { InventoryPage } from '../../pages/inventoryPage';
import { CartPage } from '../../pages/cartPage';
import { credentials } from '../../testData/testData';

test.describe('Remove Items from Cart', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);

        await loginPage.goto();
        await loginPage.login(credentials.standardUser.username, credentials.standardUser.password);
        await inventoryPage.expectOnInventoryPage();

        await inventoryPage.addProductToCart('addToCartSauceLabsBackpack');
        await inventoryPage.addProductToCart('addToCartSauceLabsBikeLight');
        await inventoryPage.expectCartCount(2);
    });

    test('should remove an item from cart on the inventory page', async () => {
        const productDataTestId = 'removeSauceLabsBackpack';
        const productName = 'Sauce Labs Backpack';

        await inventoryPage.removeProductFromCart(productDataTestId);
        await inventoryPage.expectCartCount(1);

        await inventoryPage.navigateToCart();
        await cartPage.expectOnCartPage();
        await cartPage.expectItemNotInCart(productName);
        await expect(await cartPage.getNumberOfItemsInCart()).toBe(1);
    });

    test('should remove an item from cart on the cart page', async () => {
        const productNameToRemove = 'Sauce Labs Bike Light';

        await inventoryPage.navigateToCart();
        await cartPage.expectOnCartPage();
        await cartPage.expectItemInCart(productNameToRemove);

        await cartPage.removeItem(productNameToRemove);
        await inventoryPage.expectCartCount(1);

        await cartPage.clickContinueShopping();
        await inventoryPage.expectOnInventoryPage();
        await inventoryPage.expectCartCount(1);
    });

    test('should remove all items and empty the cart', async () => {
        const backpackId = 'removeSauceLabsBackpack';
        const bikeLightId = 'removeSauceLabsBikeLight';

        await inventoryPage.removeProductFromCart(backpackId);
        await inventoryPage.removeProductFromCart(bikeLightId);
        await inventoryPage.expectCartCount(0);

        await inventoryPage.navigateToCart();
        await cartPage.expectOnCartPage();
        await expect(await cartPage.getNumberOfItemsInCart()).toBe(0);
    });
});
