import { Page, Locator, expect } from '@playwright/test';
import { Logger } from '../utils/logger';
import { SelfHealingLocator, LocatorStrategy } from '../utils/selfHealingLocator';

export abstract class BasePage {
  protected page: Page;
  protected logger: Logger;
  protected healingLocator: SelfHealingLocator;
  protected baseUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.logger = new Logger(this.constructor.name);
    this.healingLocator = new SelfHealingLocator(page);
    this.baseUrl = 'https://www.saucedemo.com';
  }

  // Core navigation methods
  async navigateTo(path: string = ''): Promise<void> {
    const url = `${this.baseUrl}${path}`;
    this.logger.info(`Navigating to: ${url}`);
    await this.page.goto(url);
    await this.waitForPageLoad();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Self-healing locator methods
  protected async findElement(strategy: LocatorStrategy): Promise<Locator> {
    return await this.healingLocator.findElement(strategy);
  }

  protected async clickElement(strategy: LocatorStrategy): Promise<void> {
    const element = await this.findElement(strategy);
    this.logger.debug(`Clicking element: ${strategy.description}`);
    await element.click();
  }

  protected async fillElement(strategy: LocatorStrategy, text: string): Promise<void> {
    const element = await this.findElement(strategy);
    this.logger.debug(`Filling element: ${strategy.description} with: ${text}`);
    await element.fill(text);
  }

  protected async getText(strategy: LocatorStrategy): Promise<string> {
    const element = await this.findElement(strategy);
    this.logger.debug(`Getting text from element: ${strategy.description}`);
    return await element.textContent() || '';
  }

  protected async isVisible(strategy: LocatorStrategy): Promise<boolean> {
    try {
      const element = await this.findElement(strategy);
      return await element.isVisible();
    } catch (error) {
      this.logger.debug(`Element not found or not visible: ${strategy.description}`);
      return false;
    }
  }

  // Validation methods
  async verifyPageTitle(expectedTitle: string): Promise<void> {
    this.logger.info(`Verifying page title: ${expectedTitle}`);
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  async verifyPageUrl(expectedUrl: string): Promise<void> {
    this.logger.info(`Verifying page URL contains: ${expectedUrl}`);
    await expect(this.page).toHaveURL(new RegExp(expectedUrl));
  }

  protected async verifyElementText(strategy: LocatorStrategy, expectedText: string): Promise<void> {
    const element = await this.findElement(strategy);
    this.logger.info(`Verifying element text: ${expectedText}`);
    await expect(element).toHaveText(expectedText);
  }

  protected async verifyElementVisible(strategy: LocatorStrategy): Promise<void> {
    this.logger.info(`Verifying element is visible: ${strategy.description}`);
    const element = await this.findElement(strategy);
    await expect(element).toBeVisible();
  }

  // Visual testing methods
  async takeFullPageScreenshot(name: string): Promise<void> {
    this.logger.info(`Taking full page screenshot: ${name}`);
    await expect(this.page).toHaveScreenshot(`${name}-full-page.png`, {
      fullPage: true,
      animations: 'disabled'
    });
  }

  async takeElementScreenshot(strategy: LocatorStrategy, name: string): Promise<void> {
    this.logger.info(`Taking element screenshot: ${name} - ${strategy.description}`);
    const element = await this.findElement(strategy);
    await expect(element).toHaveScreenshot(`${name}-element.png`, {
      animations: 'disabled'
    });
  }

  async compareVisualRegression(name: string, options?: { fullPage?: boolean; threshold?: number }): Promise<void> {
    this.logger.info(`Performing visual regression test: ${name}`);
    const screenshotOptions = {
      fullPage: options?.fullPage ?? true,
      animations: 'disabled' as const,
      threshold: options?.threshold ?? 0.3
    };
    
    await expect(this.page).toHaveScreenshot(`${name}-visual-regression.png`, screenshotOptions);
  }

  async waitForPageStability(timeout: number = 2000): Promise<void> {
    this.logger.info('Waiting for page to stabilize before visual testing');
    // Wait for animations and async operations to complete
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(timeout);
  }

  async hideElement(strategy: LocatorStrategy): Promise<void> {
    this.logger.debug(`Hiding element for visual testing: ${strategy.description}`);
    const element = await this.findElement(strategy);
    await element.evaluate(el => {
      (el as HTMLElement).style.visibility = 'hidden';
    });
  }

  async maskElement(strategy: LocatorStrategy): Promise<void> {
    this.logger.debug(`Masking element for visual testing: ${strategy.description}`);
    const element = await this.findElement(strategy);
    await element.evaluate(el => {
      (el as HTMLElement).style.filter = 'blur(10px)';
    });
  }

  async hideElementsBySelector(selectors: string[]): Promise<void> {
    this.logger.debug('Hiding dynamic elements for consistent visual testing');
    for (const selector of selectors) {
      try {
        await this.page.evaluate((sel) => {
          const elements = document.querySelectorAll(sel);
          elements.forEach(el => {
            (el as HTMLElement).style.visibility = 'hidden';
          });
        }, selector);
      } catch (error) {
        this.logger.debug(`Could not hide elements with selector: ${selector}`);
      }
    }
  }

  // Alias for consistency with visual test helper
  async hideElementsBySelectors(selectors: string[]): Promise<void> {
    return this.hideElementsBySelector(selectors);
  }

  // Abstract methods that must be implemented by child classes
  abstract isLoaded(): Promise<boolean>;
  abstract getPageIdentifier(): string;
}