import {test,expect} from '@playwright/test';
import {InventoryPage} from '../../pages/inventoryPage';    
import {credentials} from '../../testData/testData';
import {LoginPage} from '../../pages/loginPage';

test('openAboutPage', async ({page}) => {
    const inventoryPage = new InventoryPage(page);
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(credentials.standardUser.username, credentials.standardUser.password);

    await expect(inventoryPage.productsTitle).toBeVisible();

    await inventoryPage.menuButton.click();
    await inventoryPage.aboutLink.click();

    await expect(page).toHaveURL(/saucelabs/);
});
