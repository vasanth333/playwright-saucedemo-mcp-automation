import { Page, Locator, expect } from '@playwright/test';
import { Logger } from './logger';

/**
 * Visual testing utility class with advanced screenshot capabilities
 */
export class VisualTestHelper {
  private logger: Logger;

  constructor(private page: Page, component: string = 'VisualTestHelper') {
    this.logger = new Logger(component);
  }

  /**
   * Take a full page screenshot with enhanced stability
   */
  async captureFullPageScreenshot(name: string, options?: VisualCaptureOptions): Promise<void> {
    this.logger.info(`Taking full page screenshot: ${name}`);
    
    // Wait for page stability
    await this.waitForPageStability(options?.stabilityTimeout);
    
    // Hide dynamic elements if specified
    if (options?.hideDynamicElements) {
      await this.hideDynamicElements();
    }

    // Mask elements if specified  
    if (options?.maskElements) {
      await this.maskElementsBySelectors(options.maskElements);
    }

    await expect(this.page).toHaveScreenshot(`${name}-full-page.png`, {
      fullPage: true,
      animations: 'disabled',
      threshold: options?.threshold ?? 0.3,
      clip: options?.clip
    });
  }

  /**
   * Take an element screenshot with enhanced targeting
   */
  async captureElementScreenshot(\n    selector: string, \n    name: string, \n    options?: VisualCaptureOptions\n  ): Promise<void> {\n    this.logger.info(`Taking element screenshot: ${name}`);\n    \n    const element = this.page.locator(selector);\n    await element.waitFor({ state: 'visible' });\n    \n    // Wait for element stability\n    await this.waitForElementStability(element, options?.stabilityTimeout);\n    \n    await expect(element).toHaveScreenshot(`${name}-element.png`, {\n      animations: 'disabled',\n      threshold: options?.threshold ?? 0.3\n    });\n  }\n\n  /**\n   * Compare visual state against baseline with retry logic\n   */\n  async compareVisualRegression(\n    name: string, \n    options?: VisualCompareOptions\n  ): Promise<void> {\n    this.logger.info(`Performing visual regression test: ${name}`);\n    \n    const maxRetries = options?.retries ?? 3;\n    let attempt = 0;\n    \n    while (attempt < maxRetries) {\n      try {\n        await this.waitForPageStability(options?.stabilityTimeout);\n        \n        if (options?.hideDynamicElements) {\n          await this.hideDynamicElements();\n        }\n        \n        await expect(this.page).toHaveScreenshot(`${name}-visual-regression.png`, {\n          fullPage: options?.fullPage ?? true,\n          animations: 'disabled',\n          threshold: options?.threshold ?? 0.3,\n          clip: options?.clip\n        });\n        \n        this.logger.info(`Visual regression test passed: ${name}`);\n        return;\n        \n      } catch (error) {\n        attempt++;\n        this.logger.warn(`Visual regression attempt ${attempt} failed: ${error}`);\n        \n        if (attempt >= maxRetries) {\n          throw error;\n        }\n        \n        // Wait before retry\n        await this.page.waitForTimeout(1000);\n      }\n    }\n  }\n\n  /**\n   * Wait for page to reach stable state\n   */\n  async waitForPageStability(timeout: number = 2000): Promise<void> {\n    this.logger.debug('Waiting for page stability');\n    \n    // Wait for network to be idle\n    await this.page.waitForLoadState('networkidle', { timeout: 30000 });\n    \n    // Wait for any animations to complete\n    await this.page.waitForTimeout(timeout);\n    \n    // Wait for any fonts to load\n    await this.page.evaluate(() => document.fonts.ready);\n  }\n\n  /**\n   * Wait for element to reach stable state\n   */\n  async waitForElementStability(element: Locator, timeout: number = 1000): Promise<void> {\n    this.logger.debug('Waiting for element stability');\n    \n    // Wait for element to be stable (not moving)\n    await element.waitFor({ state: 'visible' });\n    \n    // Check if element position is stable\n    let previousBox = await element.boundingBox();\n    await this.page.waitForTimeout(100);\n    \n    let currentBox = await element.boundingBox();\n    let stableCount = 0;\n    const maxChecks = timeout / 100;\n    \n    while (stableCount < 3 && stableCount < maxChecks) {\n      if (previousBox && currentBox && \n          previousBox.x === currentBox.x && \n          previousBox.y === currentBox.y &&\n          previousBox.width === currentBox.width &&\n          previousBox.height === currentBox.height) {\n        stableCount++;\n      } else {\n        stableCount = 0;\n      }\n      \n      previousBox = currentBox;\n      await this.page.waitForTimeout(100);\n      currentBox = await element.boundingBox();\n    }\n  }\n\n  /**\n   * Hide commonly dynamic elements\n   */\n  async hideDynamicElements(): Promise<void> {\n    const dynamicSelectors = [\n      '.shopping_cart_badge', // Cart count badges\n      '.timestamp', // Any timestamp elements  \n      '.loading', // Loading indicators\n      '.spinner', // Spinners\n      '[data-dynamic]', // Elements marked as dynamic\n      '.flash-message', // Flash messages\n      '.notification' // Notifications\n    ];\n    \n    await this.hideElementsBySelectors(dynamicSelectors);\n  }\n\n  /**\n   * Hide elements by CSS selectors\n   */\n  async hideElementsBySelectors(selectors: string[]): Promise<void> {\n    for (const selector of selectors) {\n      try {\n        await this.page.evaluate((sel) => {\n          const elements = document.querySelectorAll(sel);\n          elements.forEach(el => {\n            (el as HTMLElement).style.visibility = 'hidden';\n          });\n        }, selector);\n      } catch (error) {\n        // Continue if element not found\n        this.logger.debug(`Could not hide elements with selector: ${selector}`);\n      }\n    }\n  }\n\n  /**\n   * Mask elements by applying blur filter\n   */\n  async maskElementsBySelectors(selectors: string[]): Promise<void> {\n    for (const selector of selectors) {\n      try {\n        await this.page.evaluate((sel) => {\n          const elements = document.querySelectorAll(sel);\n          elements.forEach(el => {\n            (el as HTMLElement).style.filter = 'blur(10px)';\n          });\n        }, selector);\n      } catch (error) {\n        this.logger.debug(`Could not mask elements with selector: ${selector}`);\n      }\n    }\n  }\n\n  /**\n   * Capture viewport variations for responsive testing\n   */\n  async captureResponsiveViews(name: string, viewports: ViewportConfig[]): Promise<void> {\n    for (const viewport of viewports) {\n      this.logger.info(`Capturing ${viewport.name} view: ${viewport.width}x${viewport.height}`);\n      \n      await this.page.setViewportSize({ \n        width: viewport.width, \n        height: viewport.height \n      });\n      \n      await this.waitForPageStability();\n      await this.captureFullPageScreenshot(`${name}-${viewport.name}`);\n    }\n  }\n\n  /**\n   * Test color scheme variations\n   */\n  async captureColorSchemeViews(name: string): Promise<void> {\n    // Light mode\n    await this.page.emulateMedia({ colorScheme: 'light' });\n    await this.waitForPageStability(1000);\n    await this.captureFullPageScreenshot(`${name}-light-mode`);\n    \n    // Dark mode\n    await this.page.emulateMedia({ colorScheme: 'dark' });\n    await this.waitForPageStability(1000);\n    await this.captureFullPageScreenshot(`${name}-dark-mode`);\n    \n    // Reset to no preference\n    await this.page.emulateMedia({ colorScheme: 'no-preference' });\n  }\n}\n\n// Type definitions\ninterface VisualCaptureOptions {\n  threshold?: number;\n  stabilityTimeout?: number;\n  hideDynamicElements?: boolean;\n  maskElements?: string[];\n  clip?: { x: number; y: number; width: number; height: number };\n}\n\ninterface VisualCompareOptions extends VisualCaptureOptions {\n  fullPage?: boolean;\n  retries?: number;\n}\n\ninterface ViewportConfig {\n  name: string;\n  width: number;\n  height: number;\n}