import { Page, Locator } from '@playwright/test';
import { Logger } from './logger';

export interface LocatorStrategy {
  primary: string;
  fallbacks: string[];
  description: string;
}

export class SelfHealingLocator {
  private page: Page;
  private logger: Logger;
  private healingAttempts: Map<string, number>;
  private maxHealingAttempts = 3;

  constructor(page: Page) {
    this.page = page;
    this.logger = new Logger('SelfHealingLocator');
    this.healingAttempts = new Map();
  }

  async findElement(strategy: LocatorStrategy): Promise<Locator> {
    const { primary, fallbacks, description } = strategy;
    
    try {
      // Try primary locator first
      const primaryLocator = this.page.locator(primary);
      await primaryLocator.waitFor({ timeout: 5000 });
      this.logger.debug(`Primary locator successful for ${description}: ${primary}`);
      return primaryLocator;
    } catch (primaryError) {
      this.logger.warn(`Primary locator failed for ${description}: ${primary}`);
      return await this.healWithFallbacks(fallbacks, description);
    }
  }

  private async healWithFallbacks(fallbacks: string[], description: string): Promise<Locator> {
    if (!fallbacks || fallbacks.length === 0) {
      throw new Error(`No fallback strategies available for: ${description}`);
    }
    
    for (let i = 0; i < fallbacks.length; i++) {
      const fallback = fallbacks[i];
      
      try {
        const fallbackLocator = this.page.locator(fallback);
        await fallbackLocator.waitFor({ timeout: 3000 });
        
        this.recordHealingSuccess(fallback, description);
        this.logger.info(`Self-healing successful for ${description} using fallback ${i + 1}: ${fallback}`);
        return fallbackLocator;
      } catch (fallbackError) {
        this.logger.debug(`Fallback ${i + 1} failed for ${description}: ${fallback}`);
      }
    }

    // All locators failed
    this.recordHealingFailure(description);
    throw new Error(`All locator strategies failed for ${description}. Primary and ${fallbacks.length} fallbacks exhausted.`);
  }

  private recordHealingSuccess(locator: string, description: string): void {
    const key = `${description}-${locator}`;
    const attempts = this.healingAttempts.get(key) || 0;
    this.healingAttempts.set(key, attempts + 1);
    
    if (attempts + 1 > this.maxHealingAttempts) {
      this.logger.error(`Healing strategy for ${description} has been used ${attempts + 1} times. Consider updating primary locator.`);
    }
  }

  private recordHealingFailure(description: string): void {
    this.logger.error(`Complete healing failure for ${description}. Manual intervention required.`);
  }

  // Pre-defined strategies for SauceDemo elements
  static getLoginPageStrategies() {
    return {
      usernameInput: {
        primary: '[data-test="username"]',
        fallbacks: ['#user-name', 'input[placeholder*="Username"]'],
        description: 'Username Input'
      },
      passwordInput: {
        primary: '[data-test="password"]',
        fallbacks: ['#password', 'input[placeholder*="Password"]'],
        description: 'Password Input'
      },
      loginButton: {
        primary: '[data-test="login-button"]',
        fallbacks: ['#login-button', 'input[type="submit"]', 'button:has-text("Login")'],
        description: 'Login Button'
      },
      errorMessage: {
        primary: '[data-test="error"]',
        fallbacks: ['h3[data-test="error"]', '.error-message-container'],
        description: 'Error Message'
      }
    };
  }
}