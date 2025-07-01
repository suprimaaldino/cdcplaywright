import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { credentials } from '../pages/testData';

test('Login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(credentials.standardUser.username, credentials.standardUser.password);

  await expect(page).toHaveURL(/inventory/);
});
