import { Page, Locator, expect } from '@playwright/test';
import { urls } from '../testData/testData';

export class InventoryPage {
    readonly page: Page;
    readonly productsTitle: Locator;
    readonly shoppingCartBadge: Locator;
    readonly shoppingCartLink: Locator;
    readonly menuButton: Locator;
    readonly inventoryItems: Locator;
    readonly inventoryItemNames: Locator;
    readonly sortDropdown: Locator;
    readonly productContainer: (productName: string) => Locator;
    readonly addToCartButton: (productName: string) => Locator;
    readonly removeButton: (productName: string) => Locator;
    readonly aboutLink: Locator;


    constructor(page: Page) {
        this.page = page;

        // Static locators
        this.productsTitle = page.locator('div.product_label');
        this.shoppingCartBadge = page.locator('span.shopping_cart_badge');
        this.shoppingCartLink = page.locator('a.shopping_cart_link');
        this.menuButton = page.getByRole('button', { name: 'Open Menu' });
        this.inventoryItems = page.locator('div.inventory_item');
        this.inventoryItemNames = page.locator('.inventory_item_name');
        this.sortDropdown = page.locator('.product_sort_container');
        this.aboutLink = page.getByRole('link', { name: 'About' });
        this.productContainer = (productName: string) =>
            this.inventoryItems.filter({
                has: this.page.getByText(productName, { exact: true })
                    .locator('xpath=./ancestor::div[@class="inventory_item"]')
            });

        this.addToCartButton = (productName: string) =>
            this.productContainer(productName).getByRole('button', { name: 'ADD TO CART' });

        this.removeButton = (productName: string) =>
            this.productContainer(productName).getByRole('button', { name: 'REMOVE' });
    }

    async addProductToCart(productName: string): Promise<void> {
        await expect(this.addToCartButton(productName)).toBeVisible();
        await this.addToCartButton(productName).click();
        await expect(this.removeButton(productName)).toBeVisible({ timeout: 5000 });
    }

    async removeProductFromCart(productName: string): Promise<void> {
        await expect(this.removeButton(productName)).toBeVisible();
        await this.removeButton(productName).click();
        await expect(this.addToCartButton(productName)).toBeVisible({ timeout: 5000 });
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

    async getAllProductNames(): Promise<string[]> {
        await this.page.waitForSelector('.inventory_item_name');
        const productElements = await this.page.locator('.inventory_item_name').all();
        return Promise.all(
            productElements.map(async (element) => {
                const name = await element.textContent();
                return name?.trim() || '';
            })
        );
    }

    async goto(): Promise<void> {
        await this.page.goto(urls.inventoryPage);
        await this.verifyPageLoaded();
    }
}