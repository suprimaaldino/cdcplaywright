import { Page, Locator, expect } from '@playwright/test';
export class InventoryPage {
  readonly page: Page;
  readonly addToCartButton: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.locator('[data-test^="add-to-cart-"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async addItem(itemSelector: string): Promise<void> {
    const itemButton = this.page.locator(itemSelector);
    await itemButton.click();
  }

  async verifyCartCount(expectedCount: string): Promise<void> {
    await expect(this.cartBadge).toHaveText(expectedCount);
  }
}
export class InventoryPageWithAssertions extends InventoryPage {
  async verifyItemAdded(itemSelector: string): Promise<void> {
    const itemButton = this.page.locator(itemSelector);
    await expect(itemButton).toHaveText('Remove');
  }

  async verifyCartBadgeVisible(): Promise<void> {
    await expect(this.cartBadge).toBeVisible();
  }
}