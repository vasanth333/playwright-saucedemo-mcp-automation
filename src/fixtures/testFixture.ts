import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TestDataLoader, User } from '../data/testDataLoader';
import { Logger } from '../utils/logger';

// Define the fixtures interface
interface TestFixtures {
  loginPage: LoginPage;
  testData: TestDataLoader;
  standardUser: User;
  logger: Logger;
  authenticatedPage: Page;
}

export const test = base.extend<TestFixtures>({
  // Test data fixture
  testData: async ({}, use) => {
    const testData = TestDataLoader.getInstance();
    await use(testData);
  },

  // Login page fixture
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  // Standard user fixture
  standardUser: async ({ testData }, use) => {
    const standardUser = testData.getStandardUser();
    await use(standardUser);
  },

  // Logger fixture
  logger: async ({}, use) => {
    const logger = new Logger('TestFixture');
    await use(logger);
  },

  // Authenticated page fixture - logs in automatically
  authenticatedPage: async ({ page, loginPage, standardUser }, use) => {
    await loginPage.navigateToLogin();
    await loginPage.login(standardUser);
    await page.waitForURL('**/inventory.html');
    await use(page);
  }
});

export { expect } from '@playwright/test';