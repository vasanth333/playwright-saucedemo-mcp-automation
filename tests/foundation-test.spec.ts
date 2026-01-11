import { expect } from '@playwright/test';
import { test } from '../src/fixtures/testFixture';
import { TestDataLoader } from '../src/data/testDataLoader';
import { getEnvironment } from '../src/config/env.config';
import { LoginPage } from '../src/pages/LoginPage';
import { Logger } from '../src/utils/logger';

test.describe('Enterprise Foundation Layer Tests', () => {
  test('Environment configuration and framework validation', async ({ page, testData, logger }) => {
    logger.testStart('Environment Configuration Test');
    
    // Test environment config
    const env = getEnvironment();
    logger.step(1, `Environment loaded: ${env.name}`);
    logger.step(2, `Base URL: ${env.baseUrl}`);
    logger.step(3, `Timeout: ${env.timeout}`);
    logger.step(4, `Retries: ${env.retries}`);
    
    expect(env.baseUrl).toBe('https://www.saucedemo.com');
    expect(env.name).toBe('dev');
    expect(env.timeout).toBeGreaterThan(0);
    
    // Test navigation using environment config
    await page.goto(env.baseUrl);
    await expect(page).toHaveTitle(/Swag Labs/);
    
    // Verify login form structure
    await expect(page.locator('[data-test="username"]')).toBeVisible();
    await expect(page.locator('[data-test="password"]')).toBeVisible();
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    
    logger.info('✅ Environment configuration and page structure verified');
    logger.testEnd('Environment Configuration Test', 'PASSED');
  });

  test('Data loader and test data validation', async ({ testData, logger }) => {
    logger.testStart('Test Data Validation');
    
    // Test user data loading
    logger.step(1, 'Validating user data');
    const standardUser = testData.getStandardUser();
    expect(standardUser.username).toBe('standard_user');
    expect(standardUser.password).toBe('secret_sauce');
    expect(standardUser.userType).toBe('standard');
    logger.info(`✅ Standard user: ${standardUser.username}`);
    
    const validUsers = testData.getValidUsers();
    const invalidUsers = testData.getInvalidUsers();
    logger.info(`✅ Valid users loaded: ${validUsers.length}`);
    logger.info(`✅ Invalid users loaded: ${invalidUsers.length}`);
    
    // Test specific user lookups
    const lockedUser = testData.getUserByType('locked');
    expect(lockedUser).toBeDefined();
    expect(lockedUser?.username).toBe('locked_out_user');
    expect(lockedUser?.expectedError).toContain('locked out');
    logger.info(`✅ Locked user: ${lockedUser?.username}`);
    
    // Test product data loading
    logger.step(2, 'Validating product data');
    const products = testData.getProducts();
    expect(products.length).toBeGreaterThan(0);
    logger.info(`✅ Products loaded: ${products.length}`);
    
    // Verify specific product data
    const allProducts = testData.getProducts();
    const backpack = allProducts.find(p => p.id === 'sauce-labs-backpack');
    expect(backpack?.name).toBe('Sauce Labs Backpack');
    expect(backpack?.price).toBe('$29.99');
    logger.info(`✅ Product verified: ${backpack?.name} - ${backpack?.price}`);
    
    // Test sort options
    logger.step(3, 'Validating sort options');
    const sortOptions = testData.getSortOptions();
    expect(sortOptions.length).toBeGreaterThan(0);
    logger.info(`✅ Sort options loaded: ${sortOptions.length}`);
    
    logger.testEnd('Test Data Validation', 'PASSED');
  });

  test('Page Object Model and self-healing locators', async ({ page, standardUser, logger }) => {
    logger.testStart('Page Object Model Validation');
    
    const loginPage = new LoginPage(page);
    
    // Test page navigation and loading
    logger.step(1, 'Testing page navigation');
    await loginPage.navigateToLogin();
    const isLoaded = await loginPage.isLoaded();
    expect(isLoaded).toBeTruthy();
    logger.info('✅ Login page loaded successfully');
    
    // Test self-healing locator strategies
    logger.step(2, 'Testing self-healing locators');
    await loginPage.enterUsername(standardUser.username);
    await loginPage.enterPassword(standardUser.password);
    logger.info('✅ Self-healing locators working for form inputs');
    
    // Test authentication flow
    logger.step(3, 'Testing authentication flow');
    await loginPage.clickLoginButton();
    
    // Wait for navigation and verify success
    await page.waitForURL(/inventory/);
    await expect(page.locator('.title')).toContainText('Products');
    logger.info('✅ Authentication flow completed successfully');
    
    logger.testEnd('Page Object Model Validation', 'PASSED');
  });

  test('Enterprise logging and error handling', async ({ page, logger }) => {
    logger.testStart('Enterprise Logging Test');
    
    // Test different log levels
    logger.info('Testing info level logging');
    logger.warn('Testing warning level logging');
    logger.debug('Testing debug level logging');
    logger.error('Testing error level logging', new Error('Test error'));
    
    // Test step logging
    for (let i = 1; i <= 3; i++) {
      logger.step(i, `Testing step ${i} logging functionality`);
    }
    
    // Test error handling with invalid login
    logger.step(4, 'Testing error handling');
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
    
    try {
      await loginPage.enterUsername('invalid_user');
      await loginPage.enterPassword('invalid_password');
      await loginPage.clickLoginButton();
      
      await loginPage.verifyErrorMessage('Epic sadface: Username and password do not match any user in this service');
      logger.info('✅ Error handling working correctly');
    } catch (error) {
      logger.error('Error handling test failed', error as Error);
      throw error;
    }
    
    logger.testEnd('Enterprise Logging Test', 'PASSED');
  });
});