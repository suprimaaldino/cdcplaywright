import { Page, Locator, expect } from '@playwright/test';
import { urls } from '../testData/testData';

export class CartPage {
    private readonly page: Page;
    readonly cartList: Locator;
    readonly cartItems: Locator;
    readonly continueShoppingButton: Locator;
    readonly checkoutButton: Locator;
    readonly cartBadge: Locator;
    readonly cartTitle: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartList = page.locator('div.cart_contents_container');
        this.cartItems = page.locator('div.cart_item');
        this.continueShoppingButton = page.getByTestId('continue-shopping');
        this.checkoutButton = page.getByTestId('checkout');
        this.cartBadge = page.locator('span.shopping_cart_badge');
        this.cartTitle = page.locator('div.subheader');
    }

    private getItemLocator(itemName: string): Locator {
        return this.page.locator('div.cart_item')
            .filter({ has: this.page.getByText(itemName, { exact: true }) });
    }

    async goto(): Promise<void> {
        await this.page.goto(urls.loginPage);
        await this.verifyPageLoaded();
    }

    async verifyPageLoaded(): Promise<void> {
        await expect(this.page).toHaveURL(/cart\.html/);
        await expect(this.cartTitle).toBeVisible();
        await expect(this.cartTitle).toHaveText('Your Cart');
    }

    async verifyItemCount(expectedCount: number): Promise<void> {
        await expect(this.cartItems).toHaveCount(expectedCount);
    }

    async getItemCount(): Promise<number> {
        return await this.cartItems.count();
    }

    async verifyItemInCart(itemName: string): Promise<void> {
        await expect(this.getItemLocator(itemName)).toBeVisible();
    }

    async verifyItemNotInCart(itemName: string): Promise<void> {
        await expect(this.getItemLocator(itemName)).not.toBeVisible();
    }

    async removeItem(itemName: string): Promise<void> {
        const itemContainer = this.getItemLocator(itemName);
        const removeButton = itemContainer.getByTestId(/remove-.*/);
        await removeButton.click();
        await this.verifyItemNotInCart(itemName);
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

    async verifyCartBadgeCount(expectedCount: number): Promise<void> {
        if (expectedCount === 0) {
            await expect(this.cartBadge).not.toBeVisible();
        } else {
            await expect(this.cartBadge).toBeVisible();
            await expect(this.cartBadge).toHaveText(String(expectedCount));
        }
    }
}