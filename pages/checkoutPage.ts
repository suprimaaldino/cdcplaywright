import { Page, Locator, expect } from '@playwright/test';
import { urls } from '../testData/testData';
import { checkoutInfo } from '../testData/testData';

export class CheckoutPage {
    readonly page: Page;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly postalCodeInput: Locator;
    readonly continueButton: Locator;
    readonly cancelButton: Locator;
    readonly errorMessage: Locator;
    readonly summaryTitle: Locator;
    readonly finishButton: Locator;
    readonly checkoutCompleteContainer: Locator;
    readonly checkoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        this.continueButton = page.locator('input.btn_primary[type="submit"]');
        this.cancelButton = page.locator('[data-test="cancel"]');
        this.errorMessage = page.locator('[data-test="error"]');
        this.summaryTitle = page.locator('//div[@class="subheader"][contains(., "Checkout: Overview")]');
        this.finishButton = page.locator('a.btn_action[href*="checkout-complete"]');
        this.checkoutCompleteContainer = page.locator('h2.complete-header');

    }

    async fillCheckoutInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
        await this.continueButton.click();
    }

    async expectSummaryVisible(): Promise<void> {
        await expect(this.summaryTitle).toBeVisible();
    }

    async finishCheckout(): Promise<void> {
        await this.finishButton.click();
    }

    async expectOrderComplete(): Promise<void> {
        await expect(this.checkoutCompleteContainer).toBeVisible();
    }
}