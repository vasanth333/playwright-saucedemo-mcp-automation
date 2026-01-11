/**
 * TypeScript interfaces for better type safety and code documentation
 */

import { UserType, TestEnvironment, BrowserType, TestStatus, SortOption } from './enums';

export interface User {
  username: string;
  password: string;
  userType: UserType;
  expectedError?: string;
  isValid: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  imageSrc: string;
  category?: string;
}

export interface Environment {
  name: TestEnvironment;
  baseUrl: string;
  timeout: number;
  retries: number;
  headless: boolean;
  screenshot?: boolean;
  video?: boolean;
  trace?: boolean;
}

export interface TestConfiguration {
  environment: TestEnvironment;
  browser: BrowserType;
  headless: boolean;
  workers: number;
  timeout: number;
  retries: number;
  reporter: string[];
}

export interface TestResult {
  testId: string;
  testName: string;
  status: TestStatus;
  duration: number;
  error?: string;
  screenshot?: string;
  video?: string;
  trace?: string;
  startTime: Date;
  endTime: Date;
}

export interface LocatorStrategy {
  primary: string;
  fallback: string[];
  description: string;
  timeout?: number;
}

export interface CartItem {
  productId: string;
  productName: string;
  price: string;
  quantity: number;
}

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export interface SortData {
  value: SortOption;
  label: string;
  description: string;
}

export interface TestData {
  users: User[];
  products: Product[];
  sortOptions: SortData[];
  checkoutInfo: CheckoutInfo;
}

export interface LogEntry {
  timestamp: string;
  level: string;
  component: string;
  message: string;
  error?: Error;
  metadata?: Record<string, unknown>;
}

export interface PageMetadata {
  title: string;
  url: string;
  identifier: string;
  loadTimeout: number;
  requiredElements: string[];
}

export interface TestExecutionContext {
  environment: Environment;
  browser: BrowserType;
  testId: string;
  testName: string;
  startTime: Date;
  metadata: Record<string, unknown>;
}