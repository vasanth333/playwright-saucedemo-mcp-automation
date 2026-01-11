import { test, expect } from '@playwright/test';
import { TestDataLoader } from '../data/testDataLoader';

test.describe('Test Data Validation', () => {
  test('Verify Products Data Loading', async () => {
    console.log('🧪 Testing Products Data...\n');
    
    const testData = TestDataLoader.getInstance();
    
    // Test products loading
    const products = testData.getProducts();
    console.log('✅ Products loaded:', products.length);
    console.log('Products:', products.map(p => `${p.name} - ${p.price}`));
    
    // Verify we have expected number of products
    expect(products.length).toBe(6);
    
    // Test sort options loading
    const sortOptions = testData.getSortOptions();
    console.log('✅ Sort options loaded:', sortOptions.length);
    console.log('Sort options:', sortOptions.map(s => s.text));
    
    // Verify we have expected sort options
    expect(sortOptions.length).toBe(4);
    
    // Test specific product retrieval
    const backpack = testData.getProductById('sauce-labs-backpack');
    expect(backpack).toBeDefined();
    expect(backpack?.name).toBe('Sauce Labs Backpack');
    expect(backpack?.price).toBe('$29.99');
    
    console.log('\n🎉 Products data loading successfully!');
  });
});