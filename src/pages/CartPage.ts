import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async isLoaded(): Promise<boolean> {
    try {
      await this.page.waitForSelector('[data-test="title"]', { timeout: 5000 });
      return this.page.url().includes('/cart.html');
    } catch {
      return false;
    }
  }

  async verifyPageLoaded(): Promise<void> {
    this.logger.info('Verifying cart page is loaded');
    await this.verifyPageUrl('/cart.html');
    
    const titleStrategy = {
      primary: '[data-test="title"]',
      fallbacks: ['.title', 'span:has-text("Your Cart")'],
      description: 'Cart Title'
    };
    await this.verifyElementText(titleStrategy, 'Your Cart');
  }

  getPageIdentifier(): string {
    return 'cart-page';
  }

  // Cart item management
  async getCartItems(): Promise<string[]> {
    this.logger.info('Getting cart items');
    const items = await this.page.locator('[data-test="inventory-item-name"]').allTextContents();
    this.logger.info(`Found ${items.length} items in cart`);
    return items;
  }

  async verifyCartItemsPresent(expectedItems: string[]): Promise<void> {
    this.logger.info(`Verifying ${expectedItems.length} items are present in cart`);
    const actualItems = await this.getCartItems();
    
    for (const expectedItem of expectedItems) {
      expect(actualItems).toContain(expectedItem);
    }
  }

  async isProductInCart(productName: string): Promise<boolean> {
    this.logger.info(`Checking if product is in cart: ${productName}`);
    const cartItems = await this.getCartItems();
    return cartItems.includes(productName);
  }

  async clickCheckout(): Promise<void> {
    this.logger.info('Clicking Checkout button');
    const checkoutStrategy = {
      primary: '[data-test="checkout"]',
      fallbacks: ['button:has-text("Checkout")', '#checkout'],
      description: 'Checkout Button'
    };
    await this.clickElement(checkoutStrategy);
  }

  async proceedToCheckout(): Promise<void> {
    await this.clickCheckout();
  }

  async removeProductFromCart(productName: string): Promise<void> {
    this.logger.info(`Removing product from cart: ${productName}`);
    // Find the remove button for the specific product
    const removeStrategy = {
      primary: `[data-test="inventory-item"]:has([data-test="inventory-item-name"]:has-text("${productName}")) [data-test*="remove"]`,
      fallbacks: [`button:has-text("Remove"):near(:has-text("${productName}"))`, `.cart_item:has-text("${productName}") button:has-text("Remove")`],
      description: `Remove button for ${productName}`
    };
    await this.clickElement(removeStrategy);
  }

  async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    this.logger.info('Filling checkout information');
    
    // Fill first name
    const firstNameStrategy = {
      primary: '[data-test="firstName"]',
      fallbacks: ['#first-name', 'input[name="firstName"]'],
      description: 'First Name Field'
    };
    await this.fillElement(firstNameStrategy, firstName);
    
    // Fill last name
    const lastNameStrategy = {
      primary: '[data-test="lastName"]',
      fallbacks: ['#last-name', 'input[name="lastName"]'],
      description: 'Last Name Field'
    };
    await this.fillElement(lastNameStrategy, lastName);
    
    // Fill postal code
    const postalCodeStrategy = {
      primary: '[data-test="postalCode"]',
      fallbacks: ['#postal-code', 'input[name="postalCode"]'],
      description: 'Postal Code Field'
    };
    await this.fillElement(postalCodeStrategy, postalCode);
  }

  async continueCheckout(): Promise<void> {
    this.logger.info('Clicking Continue button on checkout page');
    const continueStrategy = {
      primary: '[data-test="continue"]',
      fallbacks: ['button:has-text("Continue")', '#continue'],
      description: 'Continue Checkout Button'
    };
    await this.clickElement(continueStrategy);
  }

  async verifyCheckoutOverview(): Promise<void> {
    this.logger.info('Verifying checkout overview page');
    await this.verifyPageUrl('/checkout-step-two.html');
    
    const titleStrategy = {
      primary: '[data-test="title"]',
      fallbacks: ['.title', 'span:has-text("Checkout: Overview")'],
      description: 'Checkout Overview Title'
    };
    await this.verifyElementText(titleStrategy, 'Checkout: Overview');
  }

  async clickContinueShopping(): Promise<void> {
    this.logger.info('Clicking Continue Shopping button');
    const continueStrategy = {
      primary: '[data-test="continue-shopping"]',
      fallbacks: ['button:has-text("Continue Shopping")', '#continue-shopping'],
      description: 'Continue Shopping Button'
    };
    await this.clickElement(continueStrategy);
  }

  async clickContinueButton(): Promise<void> {
    this.logger.info('Clicking Continue button on checkout page');
    const continueStrategy = {
      primary: '[data-test="continue"]',
      fallbacks: ['[name="continue"]', 'input[value="Continue"]', '#continue'],
      description: 'Continue Button'
    };
    await this.clickElement(continueStrategy);
  }

  // Validation methods
  async verifyCartPageLoaded(): Promise<void> {
    this.logger.info('Verifying cart page is loaded');
    await this.verifyPageUrl('/cart.html');
    
    const titleStrategy = {
      primary: '[data-test="title"]',
      fallbacks: ['.title', 'span:has-text("Your Cart")'],
      description: 'Cart Title'
    };
    await this.verifyElementText(titleStrategy, 'Your Cart');
  }

  async verifyCartIsEmpty(): Promise<void> {
    this.logger.info('Verifying cart is empty');
    const items = await this.getCartItems();
    expect(items.length).toBe(0);
  }

  async finishOrder(): Promise<void> {
    this.logger.info('Clicking Finish button to complete order');
    const finishStrategy = {
      primary: '[data-test="finish"]',
      fallbacks: ['button:has-text("Finish")', '#finish'],
      description: 'Finish Button'
    };
    await this.clickElement(finishStrategy);
  }

  async verifyOrderComplete(): Promise<void> {
    this.logger.info('Verifying order completion page');
    await this.verifyPageUrl('/checkout-complete.html');
    
    const titleStrategy = {
      primary: '[data-test="title"]',
      fallbacks: ['.title', 'span:has-text("Checkout: Complete!")'],
      description: 'Order Complete Title'
    };
    await this.verifyElementText(titleStrategy, 'Checkout: Complete!');
    
    const thankYouStrategy = {
      primary: '.complete-header',
      fallbacks: ['h2:has-text("Thank you")', '.complete-text'],
      description: 'Thank You Message'
    };
    await this.verifyElementVisible(thankYouStrategy);
  }

  // Visual testing methods for Cart Page
  async captureCartPageVisual(testName: string): Promise<void> {
    this.logger.info(`Capturing cart page visual: ${testName}`);
    await this.waitForPageStability();
    await this.takeFullPageScreenshot(`cart-page-${testName}`);
  }

  async captureCartItemsVisual(testName: string): Promise<void> {
    this.logger.info(`Capturing cart items visual: ${testName}`);
    const cartItemsStrategy = {
      primary: '.cart_list',
      fallbacks: ['.cart_contents_container', '[data-test="cart-list"]'],
      description: 'Cart Items Container'
    };
    await this.takeElementScreenshot(cartItemsStrategy, `cart-items-${testName}`);
  }

  async captureCheckoutStepOneVisual(testName: string): Promise<void> {
    this.logger.info(`Capturing checkout step one visual: ${testName}`);
    await this.waitForPageStability();
    await this.takeFullPageScreenshot(`checkout-step-one-${testName}`);
  }

  async captureCheckoutStepTwoVisual(testName: string): Promise<void> {
    this.logger.info(`Capturing checkout step two visual: ${testName}`);
    await this.waitForPageStability();
    await this.takeFullPageScreenshot(`checkout-step-two-${testName}`);
  }

  async captureOrderCompleteVisual(testName: string): Promise<void> {
    this.logger.info(`Capturing order complete visual: ${testName}`);
    await this.waitForPageStability();
    await this.takeFullPageScreenshot(`order-complete-${testName}`);
  }

  async captureCartSummaryVisual(testName: string): Promise<void> {
    this.logger.info(`Capturing cart summary visual: ${testName}`);
    const summaryStrategy = {
      primary: '.summary_info',
      fallbacks: ['.cart_summary_container', '.checkout_summary_container'],
      description: 'Cart Summary Info'
    };
    await this.takeElementScreenshot(summaryStrategy, `cart-summary-${testName}`);
  }
}