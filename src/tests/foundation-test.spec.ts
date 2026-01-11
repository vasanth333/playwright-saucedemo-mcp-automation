import { test, expect } from '@playwright/test';
import { TestDataLoader } from '../data/testDataLoader';
import { Logger } from '../utils/logger';
import { getEnvironment } from '../config/env.config';

test.describe('Foundation Layer Tests', () => {
  test('Environment Configuration Test', async () => {
    console.log('🧪 Testing Environment Config...');
    
    // Test environment config
    const env = getEnvironment();
    console.log('✅ Environment config loaded:', env.name);
    console.log('✅ Base URL:', env.baseUrl);
    console.log('✅ Timeout:', env.timeout);
    console.log('✅ Retries:', env.retries);
    
    expect(env.baseUrl).toBe('https://www.saucedemo.com');
    expect(env.name).toBe('dev');
    expect(env.timeout).toBeGreaterThan(0);
  });

  test('Logger Functionality Test', async () => {
    console.log('🧪 Testing Logger...');
    
    // Test logger
    const logger = new Logger('TestFoundation');
    
    logger.info('✅ Info logging works');
    logger.warn('✅ Warning logging works');
    logger.debug('✅ Debug logging works');
    logger.step(1, 'Step logging works');
    
    logger.testStart('Sample Test');
    logger.testEnd('Sample Test', 'PASSED');
    
    console.log('✅ Logger functionality verified');
  });

  test('Test Data Loader Test', async () => {
    console.log('🧪 Testing Data Loader...');
    
    // Test data loader
    const testData = TestDataLoader.getInstance();
    
    // Test standard user
    const standardUser = testData.getStandardUser();
    console.log('✅ Standard user loaded:', standardUser.username);
    expect(standardUser.username).toBe('standard_user');
    expect(standardUser.password).toBe('secret_sauce');
    expect(standardUser.userType).toBe('standard');
    
    // Test valid users
    const validUsers = testData.getValidUsers();
    console.log('✅ Valid users loaded, count:', validUsers.length);
    expect(validUsers.length).toBeGreaterThan(0);
    
    // Test invalid users
    const invalidUsers = testData.getInvalidUsers();
    console.log('✅ Invalid users loaded, count:', invalidUsers.length);
    expect(invalidUsers.length).toBeGreaterThan(0);
    
    // Test specific user lookup
    const lockedUser = testData.getUserByType('locked');
    expect(lockedUser).toBeDefined();
    expect(lockedUser?.username).toBe('locked_out_user');
    expect(lockedUser?.expectedError).toContain('locked out');
    
    console.log('✅ Test data loader functionality verified');
  });

  test('Foundation Integration Test', async () => {
    console.log('🧪 Testing Foundation Integration...');
    
    const logger = new Logger('IntegrationTest');
    logger.testStart('Foundation Integration Test');
    
    try {
      // Test all components work together
      const env = getEnvironment();
      const testData = TestDataLoader.getInstance();
      
      logger.step(1, `Environment loaded: ${env.name}`);
      logger.step(2, `Base URL: ${env.baseUrl}`);
      
      const users = testData.getValidUsers();
      logger.step(3, `Loaded ${users.length} valid users`);
      
      const invalidUsers = testData.getInvalidUsers();
      logger.step(4, `Loaded ${invalidUsers.length} invalid users`);
      
      console.log('\n🎉 Foundation layer integration test PASSED!');
      console.log('📋 Ready for Phase 2: Page Object Model layer');
      
      logger.testEnd('Foundation Integration Test', 'PASSED');
      
    } catch (error) {
      logger.error('Foundation integration test failed', error as Error);
      logger.testEnd('Foundation Integration Test', 'FAILED');
      throw error;
    }
  });
});