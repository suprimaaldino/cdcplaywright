import { Page, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { credentials } from '../../testData/testData';

export async function loginStandardUser(page: Page) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(
    credentials.standardUser.username,
    credentials.standardUser.password
  );
  await expect(page).toHaveURL(/inventory/);
}
