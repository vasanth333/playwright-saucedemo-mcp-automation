import { expect } from '@playwright/test';
import { test } from '../src/fixtures/testFixture';
import { TestDataLoader } from '../src/data/testDataLoader';
import { LoginPage } from '../src/pages/LoginPage';
import { InventoryPage } from '../src/pages/InventoryPage';
import { CartPage } from '../src/pages/CartPage';
import { Logger } from '../src/utils/logger';

test.describe('Enterprise Framework Integration Tests', () => {
  test('Data-driven authentication with Page Object Model', async ({ page, testData, logger }) => {
    logger.testStart('Data-driven Authentication Test');
    
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    
    // Get all users from test data
    const validUsers = testData.getValidUsers();
    const invalidUsers = testData.getInvalidUsers();
    
    logger.info(`Testing ${validUsers.length} valid users and ${invalidUsers.length} invalid users`);
    
    // Test valid users
    for (const user of validUsers) {
      logger.step(1, `Testing valid user: ${user.username}`);
      
      await loginPage.navigateToLogin();
      await loginPage.login(user);
      
      if (user.userType === 'locked') {
        await loginPage.verifyErrorMessage('Epic sadface: Sorry, this user has been locked out.');
        logger.info(`✅ Locked user ${user.username} correctly rejected`);
      } else {
        await inventoryPage.waitForPageLoad();
        await inventoryPage.verifyPageLoaded();
        logger.info(`✅ User ${user.username} successfully authenticated`);
        
        // Logout for next iteration
        await inventoryPage.logout();
      }
    }
    
    // Test invalid users
    for (const user of invalidUsers) {
      logger.step(2, `Testing invalid user: ${user.username}`);
      
      await loginPage.navigateToLogin();
      await loginPage.enterUsername(user.username);
      await loginPage.enterPassword(user.password);
      await loginPage.clickLoginButton();
      
      if (user.username === 'locked_out_user') {
        await loginPage.verifyErrorMessage('Epic sadface: Sorry, this user has been locked out.');
      } else {
        await loginPage.verifyErrorMessage('Epic sadface: Username and password do not match any user in this service');
      }
      logger.info(`✅ Invalid user ${user.username} correctly rejected`);
    }
    
    logger.testEnd('Data-driven Authentication Test', 'PASSED');
  });

  test('Complete e-commerce workflow with POM', async ({ page, standardUser, testData, logger }) => {
    logger.testStart('Complete E-commerce Workflow');
    
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    
    // Step 1: Authentication
    logger.step(1, 'User Authentication');
    await loginPage.navigateToLogin();
    await loginPage.login(standardUser);
    await inventoryPage.verifyPageLoaded();
    
    // Step 2: Product Selection (using data-driven approach)
    logger.step(2, 'Product Selection');
    const products = testData.getProducts();
    const selectedProducts = products.slice(0, 2); // Select first 2 products
    
    for (const product of selectedProducts) {
      await inventoryPage.addProductToCart(product.id);
      logger.info(`Added ${product.name} to cart`);
    }
    
    // Verify cart badge
    const cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(selectedProducts.length);
    logger.info(`✅ Cart contains ${cartCount} items`);
    
    // Step 3: Cart Review
    logger.step(3, 'Cart Review');
    await inventoryPage.navigateToCart();
    await cartPage.verifyPageLoaded();
    
    // Verify products in cart using data-driven validation
    for (const product of selectedProducts) {
      const isInCart = await cartPage.isProductInCart(product.name);
      expect(isInCart).toBeTruthy();
      logger.info(`✅ ${product.name} verified in cart`);
    }
    
    // Step 4: Checkout Process
    logger.step(4, 'Checkout Process');
    await cartPage.proceedToCheckout();
    
    // Fill checkout information
    const checkoutInfo = {
      firstName: 'John',
      lastName: 'Doe',
      postalCode: '12345'
    };
    
    await cartPage.fillCheckoutInformation(
      checkoutInfo.firstName,
      checkoutInfo.lastName,
      checkoutInfo.postalCode
    );
    
    await cartPage.continueCheckout();
    await cartPage.verifyCheckoutOverview();
    
    // Step 5: Order Completion
    logger.step(5, 'Order Completion');
    await cartPage.finishOrder();
    await cartPage.verifyOrderComplete();
    
    logger.info('✅ Complete e-commerce workflow completed successfully');
    logger.testEnd('Complete E-commerce Workflow', 'PASSED');
  });

  test('Product catalog with data-driven validation', async ({ page, standardUser, testData, logger }) => {
    logger.testStart('Product Catalog Data-driven Validation');
    
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    
    // Authentication
    await loginPage.navigateToLogin();
    await loginPage.login(standardUser);
    await inventoryPage.verifyPageLoaded();
    
    // Get products from test data
    const products = testData.getProducts();
    logger.info(`Validating ${products.length} products from test data`);
    
    // Verify each product from test data
    for (const product of products) {
      logger.step(1, `Validating product: ${product.name}`);
      
      const isDisplayed = await inventoryPage.isProductDisplayed(product.name);
      expect(isDisplayed).toBeTruthy();
      
      const displayedPrice = await inventoryPage.getProductPrice(product.name);
      expect(displayedPrice).toBe(product.price);
      
      logger.info(`✅ ${product.name} - Price: ${product.price} verified`);
    }
    
    // Test sorting functionality
    logger.step(2, 'Testing Sort Functionality');
    const sortOptions = testData.getSortOptions();
    
    for (const sortOption of sortOptions) {
      await inventoryPage.selectSortOption(sortOption.value);
      await inventoryPage.verifySortOrder(sortOption.type);
      logger.info(`✅ Sort by ${sortOption.text} verified`);
    }
    
    logger.testEnd('Product Catalog Data-driven Validation', 'PASSED');
  });
});