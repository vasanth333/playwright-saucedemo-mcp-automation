import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async isLoaded(): Promise<boolean> {
    try {
      await this.page.waitForSelector('[data-test="title"]', { timeout: 5000 });
      return this.page.url().includes('/inventory.html');
    } catch {
      return false;
    }
  }

  getPageIdentifier(): string {
    return 'inventory-page';
  }

  // Product management methods
  async getProductCount(): Promise<number> {
    const products = await this.page.locator('[data-test^="add-to-cart-"]').count();
    this.logger.info(`Found ${products} products on the page`);
    return products;
  }

  async addProductToCart(productId: string): Promise<void> {
    this.logger.info(`Adding product to cart: ${productId}`);
    const addToCartStrategy = {
      primary: `[data-test="add-to-cart-${productId}"]`,
      fallbacks: [`button:has-text("Add to cart"):near([data-test*="${productId}"])`],
      description: `Add to Cart button for ${productId}`
    };
    await this.clickElement(addToCartStrategy);
  }

  async removeProductFromCart(productId: string): Promise<void> {
    this.logger.info(`Removing product from cart: ${productId}`);
    const removeStrategy = {
      primary: `[data-test="remove-${productId}"]`,
      fallbacks: [`button:has-text("Remove"):near([data-test*="${productId}"])`],
      description: `Remove button for ${productId}`
    };
    await this.clickElement(removeStrategy);
  }

  async getCartItemCount(): Promise<number> {
    try {
      const cartBadge = await this.page.locator('[data-test="shopping-cart-badge"]');
      if (await cartBadge.isVisible()) {
        const count = await cartBadge.textContent();
        return parseInt(count || '0');
      }
      return 0;
    } catch {
      return 0;
    }
  }

  async verifyCartItemCount(expectedCount: number): Promise<void> {
    this.logger.info(`Verifying cart item count: ${expectedCount}`);
    const actualCount = await this.getCartItemCount();
    expect(actualCount).toBe(expectedCount);
  }

  async clickShoppingCart(): Promise<void> {
    this.logger.info('Clicking shopping cart');
    const cartStrategy = {
      primary: '[data-test="shopping-cart-link"]',
      fallbacks: ['#shopping_cart_container', '.shopping_cart_link'],
      description: 'Shopping Cart Link'
    };
    await this.clickElement(cartStrategy);
  }

  // Product sorting methods
  async selectSortOption(sortValue: string): Promise<void> {
    this.logger.info(`Selecting sort option: ${sortValue}`);
    const sortStrategy = {
      primary: '[data-test="product-sort-container"]',
      fallbacks: ['.product_sort_container', 'select'],
      description: 'Sort Dropdown'
    };
    const element = await this.findElement(sortStrategy);
    await element.selectOption(sortValue);
  }

  async verifySortByPriceAscending(): Promise<void> {
    this.logger.info('Verifying products are sorted by price ascending');
    const priceTexts = await this.page.locator('[data-test="inventory-item-price"]').allTextContents();
    const prices = priceTexts.map(price => parseFloat(price.replace('$', '')));
    
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    }
  }

  // Navigation methods
  async openMenu(): Promise<void> {
    this.logger.info('Opening navigation menu');
    const menuStrategy = {
      primary: '#react-burger-menu-btn',
      fallbacks: ['[data-test="open-menu"]', '.bm-burger-button'],
      description: 'Menu Button'
    };
    await this.clickElement(menuStrategy);
  }

  async clickLogout(): Promise<void> {
    this.logger.info('Clicking logout');
    const logoutStrategy = {
      primary: '[data-test="logout-sidebar-link"]',
      fallbacks: ['#logout_sidebar_link', 'text="Logout"'],
      description: 'Logout Link'
    };
    await this.clickElement(logoutStrategy);
  }

  // Validation methods
  async verifyPageLoaded(): Promise<void> {
    this.logger.info('Verifying inventory page is loaded');
    await this.verifyPageUrl('/inventory.html');
    
    const titleStrategy = {
      primary: '[data-test="title"]',
      fallbacks: ['.title', 'span:has-text("Products")'],
      description: 'Products Title'
    };
    await this.verifyElementText(titleStrategy, 'Products');
  }

  async verifyInventoryPageLoaded(): Promise<void> {
    await this.verifyPageLoaded();
  }

  async verifyProductDisplayed(productName: string): Promise<void> {
    this.logger.info(`Verifying product is displayed: ${productName}`);
    const productStrategy = {
      primary: `[data-test="inventory-item-name"]:has-text("${productName}")`,
      fallbacks: [`text="${productName}"`, `.inventory_item_name:has-text("${productName}")`],
      description: `Product: ${productName}`
    };
    await this.verifyElementVisible(productStrategy);
  }

  // Additional methods required by tests
  async logout(): Promise<void> {
    await this.openMenu();
    await this.page.waitForTimeout(500); // Wait for menu animation
    await this.clickLogout();
  }

  async navigateToCart(): Promise<void> {
    await this.clickShoppingCart();
  }

  // Visual testing methods for Inventory Page
  async captureInventoryPageVisual(testName: string): Promise<void> {
    this.logger.info(`Capturing inventory page visual: ${testName}`);
    // Hide dynamic elements that might cause visual test instability
    await this.hideElementsBySelector([
      '.shopping_cart_badge', // Cart badge might change
      '.peek' // Any peek elements
    ]);
    await this.waitForPageStability();
    await this.takeFullPageScreenshot(`inventory-page-${testName}`);
  }

  async captureProductGridVisual(testName: string): Promise<void> {
    this.logger.info(`Capturing product grid visual: ${testName}`);
    const gridStrategy = {
      primary: '.inventory_list',
      fallbacks: ['.inventory_container', '[data-test="inventory-list"]'],
      description: 'Product Grid Container'
    };
    await this.takeElementScreenshot(gridStrategy, `product-grid-${testName}`);
  }

  async captureProductCardVisual(productId: string, testName: string): Promise<void> {
    this.logger.info(`Capturing product card visual: ${productId} - ${testName}`);
    const cardStrategy = {
      primary: `[data-test="inventory-item-${productId}"]`,
      fallbacks: [`#item_${productId}`, `.inventory_item:has([data-test="add-to-cart-${productId}"])`],
      description: `Product Card ${productId}`
    };
    await this.takeElementScreenshot(cardStrategy, `product-card-${productId}-${testName}`);
  }

  async captureSortedProductsVisual(sortOption: string, testName: string): Promise<void> {
    this.logger.info(`Capturing sorted products visual: ${sortOption} - ${testName}`);
    await this.selectSortOption(sortOption);
    await this.waitForPageStability(1000); // Wait for sort animation
    await this.captureProductGridVisual(`sorted-${sortOption}-${testName}`);
  }

  async isProductDisplayed(productName: string): Promise<boolean> {
    try {
      const productStrategy = {
        primary: `[data-test="inventory-item-name"]:has-text("${productName}")`,
        fallbacks: [`text="${productName}"`, `.inventory_item_name:has-text("${productName}")`],
        description: `Product: ${productName}`
      };
      const element = await this.findElement(productStrategy);
      return await element.isVisible();
    } catch {
      return false;
    }
  }

  async getProductPrice(productName: string): Promise<string> {
    this.logger.info(`Getting price for product: ${productName}`);
    const priceStrategy = {
      primary: `[data-test="inventory-item"]:has([data-test="inventory-item-name"]:has-text("${productName}")) [data-test="inventory-item-price"]`,
      fallbacks: [`text="${productName}" + "" + ".inventory_item_price"`, `.inventory_item:has-text("${productName}") .inventory_item_price`],
      description: `Price for ${productName}`
    };
    const element = await this.findElement(priceStrategy);
    const price = await element.textContent();
    return price || '';
  }

  async verifySortOrder(sortType: string): Promise<void> {
    this.logger.info(`Verifying sort order: ${sortType}`);
    
    if (sortType === 'price-asc') {
      await this.verifySortByPriceAscending();
    } else if (sortType === 'price-desc') {
      const priceTexts = await this.page.locator('[data-test="inventory-item-price"]').allTextContents();
      const prices = priceTexts.map(price => parseFloat(price.replace('$', '')));
      
      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).toBeLessThanOrEqual(prices[i - 1]);
      }
    } else if (sortType === 'name-asc') {
      const nameTexts = await this.page.locator('[data-test="inventory-item-name"]').allTextContents();
      const sortedNames = [...nameTexts].sort();
      expect(nameTexts).toEqual(sortedNames);
    } else if (sortType === 'name-desc') {
      const nameTexts = await this.page.locator('[data-test="inventory-item-name"]').allTextContents();
      const sortedNames = [...nameTexts].sort().reverse();
      expect(nameTexts).toEqual(sortedNames);
    }
  }

  async clickProductName(productName: string): Promise<void> {
    this.logger.info(`Clicking on product: ${productName}`);
    const productStrategy = {
      primary: `[data-test="inventory-item-name"]:has-text("${productName}")`,
      fallbacks: [`text="${productName}"`, `.inventory_item_name:has-text("${productName}")`],
      description: `Product Link: ${productName}`
    };
    await this.clickElement(productStrategy);
  }
}