import { expect } from '@playwright/test';
import { test } from '../src/fixtures/testFixture';
import { LoginPage } from '../src/pages/LoginPage';
import { InventoryPage } from '../src/pages/InventoryPage';

/**
 * Simple visual regression tests that demonstrate the visual testing capabilities
 * Run with: npm run test:visual
 * Update baselines with: npm run test:visual:update
 */
test.describe('Visual Testing Demo @visual', () => {
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

  test('Product grid component visual test', async ({ page, standardUser, logger }) => {
    logger.testStart('Product Grid Component Visual Test');
    
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    
    // Setup authenticated state
    await loginPage.navigateToLogin();
    await loginPage.login(standardUser);
    await inventoryPage.verifyPageLoaded();
    
    // Hide cart badge to prevent flaky tests using page object method
    await inventoryPage.hideElementsBySelector(['.shopping_cart_badge']);
    
    // Wait for stability and take screenshot
    await inventoryPage.waitForPageStability();
    const productGrid = page.locator('.inventory_list');
    await productGrid.waitFor({ state: 'visible' });
    
    await expect(productGrid).toHaveScreenshot('product-grid-component.png', {
      animations: 'disabled'
    });
    
    logger.info('✅ Product grid component visual captured');
    logger.testEnd('Product Grid Component Visual Test', 'PASSED');
  });
});