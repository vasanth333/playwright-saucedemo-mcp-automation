import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TestDataLoader } from '../data/testDataLoader';

test.describe('Page Object Model Tests', () => {
  test('LoginPage Basic Functionality', async ({ page }) => {
    const testData = TestDataLoader.getInstance();
    const loginPage = new LoginPage(page);
    
    console.log('🧪 Testing LoginPage POM...');
    
    // Test navigation
    await loginPage.navigateToLogin();
    const isLoaded = await loginPage.isLoaded();
    expect(isLoaded).toBe(true);
    console.log('✅ LoginPage loaded successfully');
    
    // Test page elements verification
    await loginPage.verifyLoginPageElements();
    console.log('✅ All login page elements verified');
    
    // Test login with valid user
    const standardUser = testData.getStandardUser();
    await loginPage.login(standardUser);
    
    // Verify redirect (should go to inventory page)
    await page.waitForURL('**/inventory.html', { timeout: 10000 });
    console.log('✅ Successful login and redirect to inventory page');
    
    console.log('\n🎉 Page Object Model is working correctly!');
    console.log('📋 Ready for Phase 3: Complete Page Objects');
  });

  test('LoginPage Error Handling', async ({ page }) => {
    const testData = TestDataLoader.getInstance();
    const loginPage = new LoginPage(page);
    
    console.log('🧪 Testing LoginPage Error Handling...');
    
    await loginPage.navigateToLogin();
    
    // Test with invalid user
    const invalidUser = testData.getUserByType('invalid')!;
    await loginPage.login(invalidUser);
    
    // Verify error message
    await loginPage.verifyErrorMessage(invalidUser.expectedError!);
    console.log('✅ Error message verification working');
    
    console.log('\n🎉 Error handling is working correctly!');
  });
});