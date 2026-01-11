import { test, expect } from '../../fixtures/testFixture';
import { InventoryPage } from '../../pages/InventoryPage';

test.describe('Data-Driven Product Tests', () => {
  
  test('Verify All Products from JSON Data', async ({ 
    authenticatedPage, 
    testData, 
    logger 
  }) => {
    logger.testStart('Data-Driven Product Verification');

    const inventoryPage = new InventoryPage(authenticatedPage);
    const products = testData.getProducts();
    
    logger.info(`Verifying ${products.length} products from JSON data`);

    await inventoryPage.verifyInventoryPageLoaded();

    // Verify each product from JSON data
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      logger.step(i + 1, `Verifying product: ${product.name}`);
      
      // Verify product name is displayed
      await inventoryPage.verifyProductDisplayed(product.name);
      
      // Verify product price exists (simplified approach)
      const priceCount = await authenticatedPage.locator(`[data-test="inventory-item-price"]:has-text("${product.price}")`).count();
      expect(priceCount).toBeGreaterThan(0);
      
      logger.info(`✅ Product verified: ${product.name} - ${product.price} (${product.category})`);
    }

    logger.testEnd('Data-Driven Product Verification', 'PASSED');
  });

  test('Test All Sort Options from JSON Data', async ({ 
    authenticatedPage, 
    testData, 
    logger 
  }) => {
    logger.testStart('Data-Driven Sort Options Testing');

    const inventoryPage = new InventoryPage(authenticatedPage);
    const sortOptions = testData.getSortOptions();
    
    logger.info(`Testing ${sortOptions.length} sort options from JSON data`);

    await inventoryPage.verifyInventoryPageLoaded();

    for (let i = 0; i < sortOptions.length; i++) {
      const sortOption = sortOptions[i];
      
      logger.step(i + 1, `Testing sort option: ${sortOption.text}`);
      
      // Apply sort option
      await inventoryPage.selectSortOption(sortOption.value);
      
      // Verify sorting based on type
      if (sortOption.type === 'price' && sortOption.value === 'lohi') {
        await inventoryPage.verifySortByPriceAscending();
        logger.info(`✅ Price ascending sort verified`);
      }
      
      logger.info(`✅ Sort option tested: ${sortOption.text} (${sortOption.type})`);
    }

    logger.testEnd('Data-Driven Sort Options Testing', 'PASSED');
  });

  test('Add All Products to Cart using JSON Data', async ({ 
    authenticatedPage, 
    testData, 
    logger 
  }) => {
    logger.testStart('Data-Driven Add All Products to Cart');

    const inventoryPage = new InventoryPage(authenticatedPage);
    const products = testData.getProducts();
    
    logger.info(`Adding all ${products.length} products to cart using JSON data`);

    await inventoryPage.verifyInventoryPageLoaded();
    
    // Add each product to cart
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      logger.step(i + 1, `Adding to cart: ${product.name}`);
      
      await inventoryPage.addProductToCart(product.id);
      await inventoryPage.verifyCartItemCount(i + 1);
      
      logger.info(`✅ Added to cart: ${product.name} (Cart count: ${i + 1})`);
    }

    // Final verification
    await inventoryPage.verifyCartItemCount(products.length);
    logger.info(`✅ All ${products.length} products successfully added to cart`);

    logger.testEnd('Data-Driven Add All Products to Cart', 'PASSED');
  });
});