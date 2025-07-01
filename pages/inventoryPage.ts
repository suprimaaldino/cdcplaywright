import { Page, Locator, expect } from '@playwright/test';
import { urls } from '../testData/testData';

export class InventoryPage {
    private readonly page: Page;
    readonly productsTitle: Locator;
    readonly shoppingCartBadge: Locator;
    readonly shoppingCartLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productsTitle = page.locator('div.product_label');
        this.shoppingCartBadge = page.locator('span.shopping_cart_badge');
        this.shoppingCartLink = page.locator('a.shopping_cart_link');
    }

    async goto(): Promise<void> {
        await this.page.goto(urls.loginPage);
        await this.verifyPageLoaded();
    }

    async addProductToCart(productName: string): Promise<void> {
        const itemContainer = this.getProductContainer(productName);
        const addToCartButton = itemContainer.getByRole('button', { name: 'ADD TO CART' });
        
        await expect(addToCartButton).toBeVisible();
        await addToCartButton.click();
        
        const removeButton = itemContainer.getByRole('button', { name: 'REMOVE' });
        await expect(removeButton).toBeVisible({ timeout: 5000 });
    }

    async removeProductFromCart(productName: string): Promise<void> {
        const itemContainer = this.getProductContainer(productName);
        const removeButton = itemContainer.getByRole('button', { name: 'REMOVE' });
        
        await expect(removeButton).toBeVisible();
        await removeButton.click();
        
        const addToCartButton = itemContainer.getByRole('button', { name: 'ADD TO CART' });
        await expect(addToCartButton).toBeVisible({ timeout: 5000 });
    }

    private getProductContainer(productName: string): Locator {
        return this.page.locator('div.inventory_item')
            .filter({ 
                has: this.page.getByText(productName, { exact: true })
                    .locator('xpath=./ancestor::div[@class="inventory_item"]') 
            });
    }

    async getCartCount(): Promise<number> {
        return await this.shoppingCartBadge.isVisible() 
            ? Number(await this.shoppingCartBadge.textContent()) 
            : 0;
    }

    async verifyCartCount(expectedCount: number): Promise<void> {
        if (expectedCount === 0) {
            await expect(this.shoppingCartBadge).not.toBeVisible();
        } else {
            await expect(this.shoppingCartBadge).toBeVisible();
            await expect(this.shoppingCartBadge).toHaveText(String(expectedCount));
        }
    }

    async navigateToCart(): Promise<void> {
        await this.shoppingCartLink.click();
        await expect(this.page).toHaveURL(/cart\.html/);
    }

    async verifyPageLoaded(): Promise<void> {
        await expect(this.page).toHaveURL(/inventory\.html/);
        await expect(this.productsTitle).toBeVisible();
        await expect(this.productsTitle).toHaveText('Products');
    }
}