import { Page, Locator, expect } from '@playwright/test';
import { urls } from '../testData/testData';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.getByRole('button', { name: 'LOGIN' });
  }

  async goto() {
    await this.page.goto(urls.loginPage);
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
  async expectLockedOutError() {
    await this.expectErrorMessage('Epic sadface: Sorry, this user has been locked out.');
    // Verify user is still on login page
    await expect(this.page).toHaveURL(urls.loginPage);
  }

  async expectErrorMessage(expectedMessage: string) {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
    await expect(this.errorMessage).toHaveText(expectedMessage);
  }

  get errorMessage() {
    return this.page.locator('[data-test="error"], .error-message-container');
  }
}
