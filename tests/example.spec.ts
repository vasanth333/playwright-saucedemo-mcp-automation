import { expect } from '@playwright/test';
import { test } from '../src/fixtures/testFixture';
import { getEnvironment } from '../src/config/env.config';

test.describe('Enterprise Framework Validation Tests', () => {
  test('Framework architecture validation', async ({ logger, testData }) => {
    logger.testStart('Framework Architecture Validation');
    
    // Test environment configuration
    logger.step(1, 'Validating environment configuration');
    const env = getEnvironment();
    expect(env).toBeDefined();
    expect(env.baseUrl).toBe('https://www.saucedemo.com');
    expect(env.name).toBe('dev');
    logger.info(`✅ Environment: ${env.name} - ${env.baseUrl}`);
    
    // Test data loading capabilities
    logger.step(2, 'Validating data loading capabilities');
    expect(testData).toBeDefined();
    
    const users = testData.getValidUsers();
    const products = testData.getProducts();
    const sortOptions = testData.getSortOptions();
    
    expect(users.length).toBeGreaterThan(0);
    expect(products.length).toBeGreaterThan(0);
    expect(sortOptions.length).toBeGreaterThan(0);
    
    logger.info(`✅ Test Data: ${users.length} users, ${products.length} products, ${sortOptions.length} sort options`);
    
    // Test enterprise logging
    logger.step(3, 'Validating enterprise logging');
    logger.debug('Debug message test');
    logger.warn('Warning message test');
    logger.error('Error message test', new Error('Test error'));
    logger.info('✅ Enterprise logging functionality verified');
    
    logger.testEnd('Framework Architecture Validation', 'PASSED');
  });

  test('SauceDemo application accessibility with enterprise framework', async ({ page, logger }) => {
    logger.testStart('SauceDemo Application Accessibility');
    
    // Use environment configuration for navigation
    const env = getEnvironment();
    
    logger.step(1, `Navigating to ${env.baseUrl}`);
    await page.goto(env.baseUrl);
    
    // Verify page loads correctly
    await expect(page).toHaveTitle(/Swag Labs/);
    logger.info('✅ Page title verified');
    
    // Verify key elements are present
    logger.step(2, 'Validating page structure');
    await expect(page.locator('[data-test="username"]')).toBeVisible();
    await expect(page.locator('[data-test="password"]')).toBeVisible();
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    
    logger.info('✅ Login form structure verified');
    logger.testEnd('SauceDemo Application Accessibility', 'PASSED');
  });
});
