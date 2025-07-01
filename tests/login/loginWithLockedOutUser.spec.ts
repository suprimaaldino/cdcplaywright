import { test } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { credentials } from '../../testData/testData';

test('LoginWithLockedOutUser', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(
    credentials.lockedOutUser.username,
    credentials.lockedOutUser.password
  );
  await loginPage.expectLockedOutError();
});