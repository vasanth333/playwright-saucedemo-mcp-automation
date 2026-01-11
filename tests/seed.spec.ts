import { expect } from '@playwright/test';
import { test } from '../src/fixtures/testFixture';
import { LoginPage } from '../src/pages/LoginPage';
import { InventoryPage } from '../src/pages/InventoryPage';
import { CartPage } from '../src/pages/CartPage';

test.describe('Enterprise Product Catalog Tests', () => {
  test.beforeEach(async ({ page, standardUser }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    
    await loginPage.navigateToLogin();
    await loginPage.login(standardUser);
    await inventoryPage.verifyPageLoaded();
  });

  test('Data-driven product validation', async ({ page, testData, logger }) => {
    logger.testStart('Data-driven Product Validation');
    
    const inventoryPage = new InventoryPage(page);
    const products = testData.getProducts();
    
    logger.info(`Validating ${products.length} products from test data`);
    
    // Verify all products from test data are displayed
    for (const product of products) {
      logger.step(1, `Validating product: ${product.name}`);
      
      const isDisplayed = await inventoryPage.isProductDisplayed(product.name);
      expect(isDisplayed).toBeTruthy();
      
      const displayedPrice = await inventoryPage.getProductPrice(product.name);
      expect(displayedPrice).toBe(product.price);
      
      logger.info(`✅ ${product.name} validated - Price: ${product.price}`);
    }
    
    logger.testEnd('Data-driven Product Validation', 'PASSED');
  });

  test('Shopping cart functionality with POM', async ({ page, testData, logger }) => {
    logger.testStart('Shopping Cart Functionality Test');
    
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const products = testData.getProducts();
    
    // Add multiple products using data-driven approach
    const productsToAdd = products.slice(0, 3); // Add first 3 products
    
    logger.step(1, `Adding ${productsToAdd.length} products to cart`);
    for (const product of productsToAdd) {
      await inventoryPage.addProductToCart(product.id);
      logger.info(`Added ${product.name} to cart`);
    }
    
    // Verify cart count
    const cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(productsToAdd.length);
    logger.info(`✅ Cart badge shows ${cartCount} items`);
    
    // Navigate to cart and verify contents
    logger.step(2, 'Verifying cart contents');
    await inventoryPage.navigateToCart();
    await cartPage.verifyPageLoaded();
    
    // Verify each added product is in cart
    for (const product of productsToAdd) {
      const isInCart = await cartPage.isProductInCart(product.name);
      expect(isInCart).toBeTruthy();
      logger.info(`✅ ${product.name} verified in cart`);
    }
    
    // Test remove functionality
    logger.step(3, 'Testing remove functionality');
    const firstProduct = productsToAdd[0];
    await cartPage.removeProductFromCart(firstProduct.name);
    
    const isStillInCart = await cartPage.isProductInCart(firstProduct.name);
    expect(isStillInCart).toBeFalsy();
    logger.info(`✅ ${firstProduct.name} successfully removed from cart`);
    
    logger.testEnd('Shopping Cart Functionality Test', 'PASSED');
  });

  test('Product sorting with data validation', async ({ page, testData, logger }) => {
    logger.testStart('Product Sorting Validation');
    
    const inventoryPage = new InventoryPage(page);
    const sortOptions = testData.getSortOptions();
    
    logger.info(`Testing ${sortOptions.length} sort options`);
    
    for (const sortOption of sortOptions) {
      logger.step(1, `Testing sort: ${sortOption.text}`);
      
      await inventoryPage.selectSortOption(sortOption.value);
      
      // Verify sort order based on type
      await inventoryPage.verifySortOrder(sortOption.type);
      
      logger.info(`✅ Sort by ${sortOption.text} verified`);
    }
    
    logger.testEnd('Product Sorting Validation', 'PASSED');
  });

  test('Product details and interactions', async ({ page, testData, logger }) => {
    logger.testStart('Product Details and Interactions');
    
    const inventoryPage = new InventoryPage(page);
    const products = testData.getProducts();
    const testProduct = products[0]; // Test first product
    
    logger.step(1, `Testing product details for: ${testProduct.name}`);
    
    // Click on product to view details
    await inventoryPage.clickProductName(testProduct.name);
    
    // Verify we're on product detail page (note: URL uses numeric ID, not product slug)
    await expect(page).toHaveURL(/inventory-item\.html\?id=\d+/);
    
    // Verify product details match test data
    await expect(page.locator('.inventory_details_name')).toContainText(testProduct.name);
    await expect(page.locator('.inventory_details_price')).toContainText(testProduct.price);
    await expect(page.locator('.inventory_details_desc')).toContainText(testProduct.description);
    
    logger.info(`✅ Product details verified for ${testProduct.name}`);
    
    // Test add to cart from detail page
    logger.step(2, 'Testing add to cart from detail page');
    await page.click('[data-test="add-to-cart"]'); // Generic add to cart button on detail page
    
    // Verify cart badge
    await expect(page.locator('.shopping_cart_badge')).toContainText('1');
    
    // Verify button changed to remove
    await expect(page.locator('[data-test="remove"]')).toBeVisible(); // Generic remove button on detail page
    
    logger.info('✅ Add to cart from detail page working correctly');
    
    logger.testEnd('Product Details and Interactions', 'PASSED');
  });
});
