import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TestDataLoader } from '../data/testDataLoader';

test('Debug Product IDs', async ({ page }) => {
  const testData = TestDataLoader.getInstance();
  const loginPage = new LoginPage(page);
  
  // Login first
  await loginPage.navigateToLogin();
  await loginPage.login(testData.getStandardUser());
  await page.waitForURL('**/inventory.html');
  
  // Get all add to cart buttons and their data-test attributes
  const addToCartButtons = await page.locator('[data-test^="add-to-cart-"]').all();
  
  console.log('\n🔍 Actual Product IDs on website:');
  for (let i = 0; i < addToCartButtons.length; i++) {
    const button = addToCartButtons[i];
    const dataTest = await button.getAttribute('data-test');
    const productName = await page.locator(`[data-test="inventory-item-name"]`).nth(i).textContent();
    console.log(`${i + 1}. ${productName} → ${dataTest}`);
  }
});