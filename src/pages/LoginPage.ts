import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { SelfHealingLocator } from '../utils/selfHealingLocator';
import { User } from '../data/testDataLoader';

export class LoginPage extends BasePage {
  private readonly loginStrategies = SelfHealingLocator.getLoginPageStrategies();

  constructor(page: Page) {
    super(page);
  }

  async isLoaded(): Promise<boolean> {
    try {
      await this.findElement(this.loginStrategies.loginButton);
      return true;
    } catch {
      return false;
    }
  }

  getPageIdentifier(): string {
    return 'login-page';
  }

  // Core login actions
  async enterUsername(username: string): Promise<void> {
    this.logger.step(1, `Entering username: ${username}`);
    await this.fillElement(this.loginStrategies.usernameInput, username);
  }

  async enterPassword(password: string): Promise<void> {
    this.logger.step(2, `Entering password: ${'*'.repeat(password.length)}`);
    await this.fillElement(this.loginStrategies.passwordInput, password);
  }

  async clickLoginButton(): Promise<void> {
    this.logger.step(3, 'Clicking login button');
    await this.clickElement(this.loginStrategies.loginButton);
  }

  async login(user: User): Promise<void> {
    this.logger.info(`Attempting login with user: ${user.username} (${user.userType})`);
    await this.enterUsername(user.username);
    await this.enterPassword(user.password);
    await this.clickLoginButton();
  }

  // Validation methods
  async verifyLoginPageElements(): Promise<void> {
    this.logger.info('Verifying login page elements are present');
    await this.verifyElementVisible(this.loginStrategies.usernameInput);
    await this.verifyElementVisible(this.loginStrategies.passwordInput);
    await this.verifyElementVisible(this.loginStrategies.loginButton);
  }

  async verifyErrorMessage(expectedError: string): Promise<void> {
    this.logger.info(`Verifying error message: ${expectedError}`);
    await this.verifyElementVisible(this.loginStrategies.errorMessage);
    await this.verifyElementText(this.loginStrategies.errorMessage, expectedError);
  }

  async navigateToLogin(): Promise<void> {
    await this.navigateTo('/');
    await this.waitForPageLoad();
  }

  async waitForPageStability(timeout?: number): Promise<void> {
    return super.waitForPageStability(timeout);
  }

  // Visual testing methods for Login Page
  async captureLoginPageVisual(testName: string): Promise<void> {
    this.logger.info(`Capturing login page visual: ${testName}`);
    await this.waitForPageStability();
    await this.takeFullPageScreenshot(`login-page-${testName}`);
  }

  async captureLoginFormVisual(testName: string): Promise<void> {
    this.logger.info(`Capturing login form visual: ${testName}`);
    const formStrategy = {
      primary: '.login_wrapper',
      fallbacks: ['.login-box', '#login_button_container'],
      description: 'Login Form Container'
    };
    await this.takeElementScreenshot(formStrategy, `login-form-${testName}`);
  }

  async captureErrorStateVisual(testName: string): Promise<void> {
    this.logger.info(`Capturing error state visual: ${testName}`);
    await this.waitForPageStability(500);
    await this.takeFullPageScreenshot(`login-error-${testName}`);
  }

  async captureLoginCredentialsVisual(testName: string): Promise<void> {
    this.logger.info(`Capturing login credentials visual: ${testName}`);
    const credentialsStrategy = {
      primary: '#login_credentials',
      fallbacks: ['.login_credentials', '.credentials'],
      description: 'Login Credentials Info'
    };
    await this.takeElementScreenshot(credentialsStrategy, `login-credentials-${testName}`);
  }

  async hideElementsBySelectors(selectors: string[]): Promise<void> {
    return super.hideElementsBySelectors(selectors);
  }

  async hideDynamicElements(): Promise<void> {
    this.logger.debug('Hiding dynamic elements for consistent login page visuals');
    const dynamicSelectors = [
      '.login_logo', // May have animations
      '.bot_column', // Dynamic elements
      '.timestamp', // Any timestamp elements
      '[data-test="error"]' // Error messages that might appear
    ];
    await this.hideElementsBySelectors(dynamicSelectors);
  }
}