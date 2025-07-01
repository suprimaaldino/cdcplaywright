import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { credentials } from '../pages/testData';

test('Login with locked out user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(credentials.lockedOutUser.username, credentials.lockedOutUser.password);
  await loginPage.expectLockedOutError();

});
