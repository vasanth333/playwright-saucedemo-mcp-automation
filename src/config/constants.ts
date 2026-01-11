/**
 * Application constants and configuration values
 */

// Application URLs
export const URLS = {
  BASE_URL: 'https://www.saucedemo.com',
  LOGIN_PATH: '/',
  INVENTORY_PATH: '/inventory.html',
  CART_PATH: '/cart.html',
  CHECKOUT_STEP_ONE: '/checkout-step-one.html',
  CHECKOUT_STEP_TWO: '/checkout-step-two.html',
  CHECKOUT_COMPLETE: '/checkout-complete.html'
} as const;

// Test data identifiers
export const TEST_IDS = {
  USERNAME_INPUT: 'username',
  PASSWORD_INPUT: 'password',
  LOGIN_BUTTON: 'login-button',
  ERROR_MESSAGE: 'error',
  INVENTORY_CONTAINER: 'inventory-container',
  SHOPPING_CART_LINK: 'shopping-cart-link',
  ADD_TO_CART_PREFIX: 'add-to-cart-',
  REMOVE_PREFIX: 'remove-',
  CHECKOUT_BUTTON: 'checkout',
  CONTINUE_BUTTON: 'continue',
  FINISH_BUTTON: 'finish'
} as const;

// Product identifiers
export const PRODUCT_IDS = {
  BACKPACK: 'sauce-labs-backpack',
  BIKE_LIGHT: 'sauce-labs-bike-light',
  BOLT_T_SHIRT: 'sauce-labs-bolt-t-shirt',
  FLEECE_JACKET: 'sauce-labs-fleece-jacket',
  ONESIE: 'sauce-labs-onesie',
  RED_T_SHIRT: 'test.allthethings()-t-shirt-(red)'
} as const;

// Sort options
export const SORT_OPTIONS = {
  NAME_A_TO_Z: 'az',
  NAME_Z_TO_A: 'za', 
  PRICE_LOW_TO_HIGH: 'lohi',
  PRICE_HIGH_TO_LOW: 'hilo'
} as const;

// Timeouts (in milliseconds)
export const TIMEOUTS = {
  DEFAULT: 30000,
  NAVIGATION: 30000,
  ELEMENT_WAIT: 15000,
  ANIMATION: 1000,
  RETRY_DELAY: 500
} as const;

// Error messages
export const ERROR_MESSAGES = {
  LOCKED_USER: 'Epic sadface: Sorry, this user has been locked out.',
  INVALID_CREDENTIALS: 'Epic sadface: Username and password do not match any user in this service',
  REQUIRED_USERNAME: 'Epic sadface: Username is required',
  REQUIRED_PASSWORD: 'Epic sadface: Password is required'
} as const;

// Test tags for filtering
export const TEST_TAGS = {
  SMOKE: '@smoke',
  REGRESSION: '@regression',
  CRITICAL: '@critical',
  E2E: '@e2e',
  UNIT: '@unit',
  INTEGRATION: '@integration'
} as const;

// Environment names
export const ENVIRONMENTS = {
  DEVELOPMENT: 'dev',
  TEST: 'test',
  STAGING: 'stage',
  PRODUCTION: 'prod'
} as const;

// Log levels
export const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN', 
  INFO: 'INFO',
  DEBUG: 'DEBUG',
  STEP: 'STEP',
  TEST: 'TEST'
} as const;

// Visual testing configuration
export const VISUAL_CONFIG = {
  DEFAULT_THRESHOLD: 0.3,
  STABILITY_TIMEOUT: 2000,
  RETRY_ATTEMPTS: 3,
  SCREENSHOT_FORMATS: ['png', 'jpeg'],
  VIEWPORTS: {
    MOBILE_PORTRAIT: { width: 375, height: 667 },
    MOBILE_LANDSCAPE: { width: 667, height: 375 },
    TABLET_PORTRAIT: { width: 768, height: 1024 },
    TABLET_LANDSCAPE: { width: 1024, height: 768 },
    DESKTOP_SMALL: { width: 1366, height: 768 },
    DESKTOP_LARGE: { width: 1920, height: 1080 }
  }
} as const;

// Dynamic elements that should be hidden during visual tests
export const DYNAMIC_ELEMENTS = [
  '.shopping_cart_badge',
  '.timestamp',
  '.loading',
  '.spinner',
  '[data-dynamic]',
  '.flash-message',
  '.notification',
  '.toast'
] as const;