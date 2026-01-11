import { test, expect } from '../../fixtures/testFixture';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';

test.describe('Authentication & User Management', () => {
  test('Valid Login - Standard User', async ({ 
    loginPage, 
    standardUser, 
    logger,
    page
  }) => {
    logger.testStart('Valid Login - Standard User');

    // Step 1: Navigate to the login page
    logger.step(1, 'Navigate to https://www.saucedemo.com/');
    await loginPage.navigateToLogin();

    // Step 2: Verify login page displays with username and password fields
    logger.step(2, 'Verify login page displays with username and password fields');
    await loginPage.verifyLoginPageElements();

    // Step 3: Enter credentials and login
    logger.step(3, 'Enter standard_user credentials and click login');
    await loginPage.login(standardUser);

    // Step 4: Verify successful redirect to inventory page
    logger.step(4, 'Verify successful redirect to inventory page (/inventory.html)');
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.verifyInventoryPageLoaded();

    // Step 5: Verify application interface displays properly
    logger.step(5, 'Verify application interface displays properly for authenticated user');
    await expect(inventoryPage.isLoaded()).resolves.toBe(true);

    logger.testEnd('Valid Login - Standard User', 'PASSED');
  });

  test('Complete Shopping Flow', async ({ 
    authenticatedPage, 
    logger 
  }) => {
    logger.testStart('Complete Shopping Flow');

    const inventoryPage = new InventoryPage(authenticatedPage);
    const cartPage = new CartPage(authenticatedPage);

    // Step 1: Verify we're on inventory page
    logger.step(1, 'Verify inventory page is loaded');
    await inventoryPage.verifyInventoryPageLoaded();

    // Step 2: Verify products are displayed
    logger.step(2, 'Verify products are displayed');
    const productCount = await inventoryPage.getProductCount();
    expect(productCount).toBe(6);

    // Step 3: Add products to cart
    logger.step(3, 'Add Sauce Labs Backpack to cart');
    await inventoryPage.addProductToCart('sauce-labs-backpack');
    await inventoryPage.verifyCartItemCount(1);

    logger.step(4, 'Add Sauce Labs Bike Light to cart');
    await inventoryPage.addProductToCart('sauce-labs-bike-light');
    await inventoryPage.verifyCartItemCount(2);

    // Step 4: Navigate to cart
    logger.step(5, 'Navigate to shopping cart');
    await inventoryPage.clickShoppingCart();
    await cartPage.verifyCartPageLoaded();

    // Step 5: Verify cart contents
    logger.step(6, 'Verify cart contains expected items');
    await cartPage.verifyCartItemsPresent([
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light'
    ]);

    console.log('\n🎉 Complete shopping flow working perfectly!');
    logger.testEnd('Complete Shopping Flow', 'PASSED');
  });
});