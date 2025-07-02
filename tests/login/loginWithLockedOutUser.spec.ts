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

test.afterEach(async ({ page }, testInfo) => {
    console.log(`Finished ${testInfo.title} with status ${testInfo.status}`);

    if (testInfo.status !== testInfo.expectedStatus) {
        console.log(`Did not run as expected, ended up at ${page.url()}`);
    }
});

test.afterAll(async () => {
    console.log('All loginWithLockedOutUser tests have completed.');
});