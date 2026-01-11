import { test, expect } from '../../fixtures/testFixture';

test.describe('Data-Driven Authentication Tests', () => {
  
  // Test all valid users from JSON
  test('Login with All Valid Users', async ({ 
    loginPage, 
    testData, 
    logger,
    page 
  }) => {
    logger.testStart('Data-Driven Valid Users Login');

    const validUsers = testData.getValidUsers();
    logger.info(`Testing login with ${validUsers.length} valid users from JSON data`);

    for (let i = 0; i < validUsers.length; i++) {
      const user = validUsers[i];
      
      logger.step(i + 1, `Testing login with ${user.username} (${user.userType})`);
      
      // Navigate to login page
      await loginPage.navigateToLogin();
      
      // Login with current user
      await loginPage.login(user);
      
      // Verify successful login (should redirect to inventory)
      await page.waitForURL('**/inventory.html', { timeout: 10000 });
      logger.info(`✅ Login successful for ${user.username}`);
      
      // Logout to prepare for next user
      const inventoryPage = new (await import('../../pages/InventoryPage')).InventoryPage(page);
      await inventoryPage.openMenu();
      await inventoryPage.clickLogout();
      
      logger.info(`✅ Completed test for user: ${user.username} (${user.description})`);
    }

    logger.testEnd('Data-Driven Valid Users Login', 'PASSED');
  });

  // Test all invalid users from JSON with their expected errors
  test('Login with All Invalid Users', async ({ 
    loginPage, 
    testData, 
    logger 
  }) => {
    logger.testStart('Data-Driven Invalid Users Login');

    const invalidUsers = testData.getInvalidUsers();
    logger.info(`Testing login with ${invalidUsers.length} invalid users from JSON data`);

    for (let i = 0; i < invalidUsers.length; i++) {
      const user = invalidUsers[i];
      
      logger.step(i + 1, `Testing invalid login: ${user.username} (${user.userType})`);
      
      // Navigate to login page
      await loginPage.navigateToLogin();
      
      // Attempt login with invalid user
      await loginPage.login(user);
      
      // Verify expected error message from JSON data
      if (user.expectedError) {
        await loginPage.verifyErrorMessage(user.expectedError);
        logger.info(`✅ Correct error message displayed: "${user.expectedError}"`);
      }
      
      // Verify user remains on login page
      const isStillOnLogin = await loginPage.isLoaded();
      expect(isStillOnLogin).toBe(true);
      
      logger.info(`✅ Completed test for invalid user: ${user.username} (${user.description})`);
    }

    logger.testEnd('Data-Driven Invalid Users Login', 'PASSED');
  });
});