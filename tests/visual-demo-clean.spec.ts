import { expect } from '@playwright/test';
import { test } from '../src/fixtures/testFixture';
import { LoginPage } from '../src/pages/LoginPage';
import { InventoryPage } from '../src/pages/InventoryPage';

/**
 * Simple visual regression tests that demonstrate the visual testing capabilities
 * Run with: npm run test:visual
 * Update baselines with: npm run test:visual:update
 */
test.describe.skip('Visual Testing Demo @visual', () => {
  test('Login page baseline visual test', async ({ page, logger }) => {
    logger.testStart('Login Page Visual Baseline');
    
    const loginPage = new LoginPage(page);
    
    // Navigate to login page and wait for stability
    await loginPage.navigateToLogin();
    await loginPage.waitForPageStability();
    
    // Take baseline screenshot
    await expect(page).toHaveScreenshot('login-page-baseline.png', {
      fullPage: true,
      animations: 'disabled'
    });
    
    logger.info('✅ Login page visual baseline captured');
    logger.testEnd('Login Page Visual Baseline', 'PASSED');
  });

  test('Inventory page baseline visual test', async ({ page, standardUser, logger }) => {
    logger.testStart('Inventory Page Visual Baseline');
    
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    
    // Login and navigate to inventory
    await loginPage.navigateToLogin();
    await loginPage.login(standardUser);
    await inventoryPage.verifyPageLoaded();
    
    // Hide dynamic cart badge to prevent flaky tests
    await inventoryPage.hideElementsBySelectors(['.shopping_cart_badge']);
    
    // Wait for stability and take screenshot
    await inventoryPage.waitForPageStability();
    await expect(page).toHaveScreenshot('inventory-page-baseline.png', {
      fullPage: true,
      animations: 'disabled'
    });
    
    logger.info('✅ Inventory page visual baseline captured');
    logger.testEnd('Inventory Page Visual Baseline', 'PASSED');
  });

  test('Product grid component visual test', async ({ page, standardUser, logger }) => {
    logger.testStart('Product Grid Component Visual Test');
    
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    
    // Setup authenticated state
    await loginPage.navigateToLogin();
    await loginPage.login(standardUser);
    await inventoryPage.verifyPageLoaded();
    
    // Take screenshot of just the product grid
    const productGrid = page.locator('.inventory_list');
    await productGrid.waitFor({ state: 'visible' });
    
    await expect(productGrid).toHaveScreenshot('product-grid-component.png', {
      animations: 'disabled'
    });
    
    logger.info('✅ Product grid component visual captured');
    logger.testEnd('Product Grid Component Visual Test', 'PASSED');
  });

  test('Mobile viewport visual test', async ({ page, standardUser, logger }) => {
    logger.testStart('Mobile Viewport Visual Test');
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    
    // Test mobile login page
    await loginPage.navigateToLogin();
    await loginPage.waitForPageStability();
    await expect(page).toHaveScreenshot('login-page-mobile.png', {
      fullPage: true,
      animations: 'disabled'
    });
    
    // Test mobile inventory page
    await loginPage.login(standardUser);
    await inventoryPage.verifyPageLoaded();
    await inventoryPage.hideElementsBySelectors(['.shopping_cart_badge']);
    await inventoryPage.waitForPageStability();
    
    await expect(page).toHaveScreenshot('inventory-page-mobile.png', {
      fullPage: true,
      animations: 'disabled'
    });
    
    logger.info('✅ Mobile viewport visuals captured');
    logger.testEnd('Mobile Viewport Visual Test', 'PASSED');
  });
});