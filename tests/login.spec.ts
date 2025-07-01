import { test, expect } from '@playwright/test';
import { LoginPage } from './loginPage';
import { credentials } from './testData';

test('Login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(credentials.validUser.username, credentials.validUser.password);

  await expect(page).toHaveURL(/inventory/);
});
