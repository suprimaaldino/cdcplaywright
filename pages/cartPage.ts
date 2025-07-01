import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
    private readonly page: Page;
    private readonly cartList: Locator;
    private readonly cartItems: Locator;
    private readonly continueShoppingButton: Locator;
    private readonly checkoutButton: Locator;
    private readonly cartBadge: Locator;
    private readonly cartTitle: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartList = page.locator('.cart_contents_container');
        this.cartItems = page.locator('.cart_item');
        this.continueShoppingButton = page.getByTestId('continue-shopping');
        this.checkoutButton = page.getByTestId('checkout');
        this.cartBadge = page.locator('.shopping_cart_badge');
        this.cartTitle = page.locator('.subheader');
    }

    async verifyPageLoaded(): Promise<void> {
        await expect(this.page).toHaveURL(/cart\.html/);
        await expect(this.cartTitle).toBeVisible();
        await expect(this.cartTitle).toHaveText('Your Cart');
    }

    private getItemLocator(itemName: string): Locator {
        return this.page.locator('.cart_item')
            .filter({ has: this.page.getByText(itemName, { exact: true }) });
    }

    async removeItem(itemName: string): Promise<void> {
        const itemContainer = this.getItemLocator(itemName);
        const removeButton = itemContainer.getByRole('button', { name: 'REMOVE' });
        
        await expect(removeButton).toBeVisible();
        await removeButton.click();
        await expect(itemContainer).not.toBeVisible({ timeout: 5000 });
    }

    async removeMultipleItems(itemNames: string[]): Promise<void> {
        for (const itemName of itemNames) {
            await this.removeItem(itemName);
        }
    }

    async removeAllItems(): Promise<void> {
        const allItems = await this.getAllItemNames();
        await this.removeMultipleItems(allItems);
    }

    async getAllItemNames(): Promise<string[]> {
        await this.page.waitForSelector('.inventory_item_name');
        const itemElements = await this.page.locator('.inventory_item_name').all();
        return Promise.all(
            itemElements.map(async (element) => {
                const name = await element.textContent();
                return name?.trim() || '';
            })
        );
    }

    async verifyItemInCart(itemName: string): Promise<void> {
        await expect(this.getItemLocator(itemName)).toBeVisible();
    }

    async verifyItemNotInCart(itemName: string): Promise<void> {
        await expect(this.getItemLocator(itemName)).not.toBeVisible();
    }

    async verifyItemCount(expectedCount: number): Promise<void> {
        await expect(this.cartItems).toHaveCount(expectedCount);
    }

    async getItemCount(): Promise<number> {
        return await this.cartItems.count();
    }

    async verifyCartBadgeCount(expectedCount: number): Promise<void> {
        if (expectedCount === 0) {
            await expect(this.cartBadge).not.toBeVisible();
        } else {
            await expect(this.cartBadge).toBeVisible();
            await expect(this.cartBadge).toHaveText(String(expectedCount));
        }
    }

    async continueShopping(): Promise<void> {
        await this.continueShoppingButton.click();
        await expect(this.page).toHaveURL(/inventory\.html/);
    }

    async proceedToCheckout(): Promise<void> {
        await this.checkoutButton.click();
        await expect(this.page).toHaveURL(/checkout-step-one\.html/);
    }

    async isCartEmpty(): Promise<boolean> {
        return (await this.getItemCount()) === 0;
    }
};