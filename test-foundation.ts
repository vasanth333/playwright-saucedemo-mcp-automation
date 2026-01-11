import { TestDataLoader } from './src/data/testDataLoader';
import { Logger } from './src/utils/logger';
import { getEnvironment } from './src/config/env.config';

// Test the foundation
try {
  console.log('🧪 Testing Foundation Layer...\n');
  
  // Test environment config
  const env = getEnvironment();
  console.log('✅ Environment config loaded:', env.name, env.baseUrl);
  
  // Test logger
  const logger = new Logger('TestFoundation');
  logger.info('Logger is working correctly');
  logger.step(1, 'Testing step logging');
  
  // Test data loader
  const testData = TestDataLoader.getInstance();
  const standardUser = testData.getStandardUser();
  console.log('✅ Test data loaded, standard user:', standardUser.username);
  
  const invalidUsers = testData.getInvalidUsers();
  console.log('✅ Invalid users loaded, count:', invalidUsers.length);
  
  console.log('\n🎉 Foundation layer is working correctly!');
  console.log('\n📋 Next: Create the Page Object Model layer');
  
} catch (error) {
  console.error('❌ Foundation test failed:', (error as Error).message);
  console.log('\n🔧 Please check the file paths and content');
}