import { expect } from '@playwright/test';
import { test } from '../src/fixtures/testFixture';
import { LoginPage } from '../src/pages/LoginPage';
import { InventoryPage } from '../src/pages/InventoryPage';
import { CartPage } from '../src/pages/CartPage';

test.describe.skip('Visual Regression Tests @visual', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure consistent viewport for visual tests
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('Login page visual regression', async ({ page, logger }) => {
    logger.testStart('Login Page Visual Regression');
    
    const loginPage = new LoginPage(page);
    
    // Navigate and capture clean login page
    logger.step(1, 'Capturing clean login page');
    await loginPage.navigateToLogin();
    await loginPage.captureLoginPageVisual('clean-state');
    
    // Capture login form specifically
    logger.step(2, 'Capturing login form component');
    await loginPage.captureLoginFormVisual('default-form');
    
    // Capture login credentials info
    logger.step(3, 'Capturing login credentials display');
    await loginPage.captureLoginCredentialsVisual('credentials-info');
    
    logger.testEnd('Login Page Visual Regression', 'PASSED');
  });

  test('Login error states visual regression', async ({ page, testData, logger }) => {
    logger.testStart('Login Error States Visual Regression');
    
    const loginPage = new LoginPage(page);
    const invalidUser = testData.getInvalidUsers()[0]; // Get first invalid user
    
    // Test invalid login error state
    logger.step(1, 'Testing invalid login error visual');
    await loginPage.navigateToLogin();
    await loginPage.login(invalidUser);
    await loginPage.captureErrorStateVisual('invalid-credentials');
    
    // Test locked user error state
    logger.step(2, 'Testing locked user error visual');
    const lockedUser = testData.getUserByType('locked_out');
    if (lockedUser) {
      await loginPage.navigateToLogin();
      await loginPage.login(lockedUser);
      await loginPage.captureErrorStateVisual('locked-user');
    }
    
    logger.testEnd('Login Error States Visual Regression', 'PASSED');
  });

  test('Inventory page visual regression', async ({ page, standardUser, logger }) => {
    logger.testStart('Inventory Page Visual Regression');
    
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    
    // Login and navigate to inventory
    logger.step(1, 'Setting up authenticated state');
    await loginPage.navigateToLogin();
    await loginPage.login(standardUser);
    await inventoryPage.verifyPageLoaded();
    
    // Capture full inventory page
    logger.step(2, 'Capturing full inventory page');
    await inventoryPage.captureInventoryPageVisual('default-view');
    
    // Capture product grid specifically
    logger.step(3, 'Capturing product grid component');
    await inventoryPage.captureProductGridVisual('all-products');
    
    // Capture individual product cards
    logger.step(4, 'Capturing product card components');
    const productIds = ['sauce-labs-backpack', 'sauce-labs-bike-light'];
    for (const productId of productIds) {
      await inventoryPage.captureProductCardVisual(productId, 'default-state');
    }
    
    logger.testEnd('Inventory Page Visual Regression', 'PASSED');
  });

  test('Product sorting visual regression', async ({ page, standardUser, testData, logger }) => {
    logger.testStart('Product Sorting Visual Regression');
    
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    
    // Setup authenticated state
    logger.step(1, 'Setting up authenticated state');
    await loginPage.navigateToLogin();
    await loginPage.login(standardUser);
    await inventoryPage.verifyPageLoaded();
    
    // Test different sort options
    logger.step(2, 'Testing sort options visual states');
    const sortOptions = testData.getSortOptions();
    
    for (const sortOption of sortOptions) {
      await inventoryPage.captureSortedProductsVisual(sortOption.value, sortOption.value.replace(/\s+/g, '-').toLowerCase());
    }
    
    logger.testEnd('Product Sorting Visual Regression', 'PASSED');
  });

  test('Shopping cart workflow visual regression', async ({ page, standardUser, testData, logger }) => {
    logger.testStart('Shopping Cart Workflow Visual Regression');
    
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    
    // Setup and add products to cart
    logger.step(1, 'Setting up cart with products');
    await loginPage.navigateToLogin();
    await loginPage.login(standardUser);
    await inventoryPage.verifyPageLoaded();
    
    // Add products to cart
    const products = testData.getProducts().slice(0, 2);
    for (const product of products) {
      await inventoryPage.addProductToCart(product.id);
    }
    
    // Navigate to cart and capture visuals
    logger.step(2, 'Capturing cart page visuals');
    await inventoryPage.navigateToCart();
    await cartPage.verifyCartPageLoaded();
    await cartPage.captureCartPageVisual('with-products');
    await cartPage.captureCartItemsVisual('two-products');
    
    // Proceed to checkout and capture each step
    logger.step(3, 'Capturing checkout workflow visuals');
    await cartPage.proceedToCheckout();
    await cartPage.captureCheckoutStepOneVisual('information-form');
    
    // Fill checkout info and proceed
    await cartPage.fillCheckoutInformation('John', 'Doe', '12345');
    await cartPage.clickContinueButton();
    await cartPage.captureCheckoutStepTwoVisual('order-summary');
    await cartPage.captureCartSummaryVisual('final-totals');
    
    // Complete order
    await cartPage.finishOrder();
    await cartPage.captureOrderCompleteVisual('success-confirmation');
    
    logger.testEnd('Shopping Cart Workflow Visual Regression', 'PASSED');
  });

  test('Responsive layout visual regression', async ({ page, standardUser, logger }) => {
    logger.testStart('Responsive Layout Visual Regression');
    
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    
    // Test different viewport sizes
    const viewports = [
      { width: 1920, height: 1080, name: 'desktop-large' },
      { width: 1366, height: 768, name: 'desktop-standard' },
      { width: 768, height: 1024, name: 'tablet-portrait' },
      { width: 375, height: 667, name: 'mobile-portrait' }
    ];
    
    for (const viewport of viewports) {
      logger.step(1, `Testing ${viewport.name} viewport: ${viewport.width}x${viewport.height}`);
      
      // Set viewport
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // Login and capture inventory page
      await loginPage.navigateToLogin();
      await loginPage.captureLoginPageVisual(`responsive-${viewport.name}`);
      
      await loginPage.login(standardUser);
      await inventoryPage.verifyPageLoaded();
      await inventoryPage.captureInventoryPageVisual(`responsive-${viewport.name}`);
    }
    
    logger.testEnd('Responsive Layout Visual Regression', 'PASSED');
  });

  test('Dark mode visual regression', async ({ page, standardUser, logger }) => {
    logger.testStart('Dark Mode Visual Regression');
    
    // Enable dark mode if available
    await page.emulateMedia({ colorScheme: 'dark' });
    
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    
    logger.step(1, 'Testing login page in dark mode');
    await loginPage.navigateToLogin();
    await loginPage.captureLoginPageVisual('dark-mode');
    
    logger.step(2, 'Testing inventory page in dark mode');
    await loginPage.login(standardUser);
    await inventoryPage.verifyPageLoaded();
    await inventoryPage.captureInventoryPageVisual('dark-mode');
    
    logger.testEnd('Dark Mode Visual Regression', 'PASSED');
  });
});