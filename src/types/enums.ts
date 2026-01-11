/**
 * Enumerations for type-safe constants
 */

export enum UserType {
  STANDARD = 'standard',
  LOCKED_OUT = 'locked_out',
  PROBLEM = 'problem',
  PERFORMANCE_GLITCH = 'performance_glitch',
  INVALID = 'invalid'
}

export enum TestEnvironment {
  DEVELOPMENT = 'dev',
  TEST = 'test', 
  STAGING = 'stage',
  PRODUCTION = 'prod'
}

export enum BrowserType {
  CHROMIUM = 'chromium',
  FIREFOX = 'firefox',
  WEBKIT = 'webkit'
}

export enum TestStatus {
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  SKIPPED = 'SKIPPED',
  PENDING = 'PENDING'
}

export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO', 
  DEBUG = 'DEBUG',
  STEP = 'STEP',
  TEST = 'TEST'
}

export enum SortOption {
  NAME_A_TO_Z = 'az',
  NAME_Z_TO_A = 'za',
  PRICE_LOW_TO_HIGH = 'lohi', 
  PRICE_HIGH_TO_LOW = 'hilo'
}

export enum PageState {
  LOADING = 'loading',
  LOADED = 'loaded',
  ERROR = 'error',
  NAVIGATING = 'navigating'
}

export enum ElementState {
  VISIBLE = 'visible',
  HIDDEN = 'hidden',
  DISABLED = 'disabled',
  ENABLED = 'enabled',
  FOCUSED = 'focused'
}