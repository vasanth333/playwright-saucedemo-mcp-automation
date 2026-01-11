import { FullConfig } from '@playwright/test';
import { Logger } from '../utils/logger';
import { getEnvironment } from './env.config';
import * as fs from 'fs';
import * as path from 'path';

const logger = new Logger('GlobalSetup');

async function globalSetup(config: FullConfig) {
  logger.info('Starting global setup...');
  
  try {
    // Log environment configuration
    const env = getEnvironment();
    logger.info(`Environment: ${env.name}`);
    logger.info(`Base URL: ${env.baseUrl}`);
    
    // Ensure test results directory exists
    const testResultsDir = path.join(process.cwd(), 'test-results');
    if (!fs.existsSync(testResultsDir)) {
      fs.mkdirSync(testResultsDir, { recursive: true });
      logger.info('Created test results directory');
    }
    
    // Ensure test artifacts directory exists
    const artifactsDir = path.join(testResultsDir, 'artifacts');
    if (!fs.existsSync(artifactsDir)) {
      fs.mkdirSync(artifactsDir, { recursive: true });
      logger.info('Created test artifacts directory');
    }
    
    // Log test configuration
    logger.info(`Projects: ${config.projects.map(p => p.name).join(', ')}`);
    logger.info(`Workers: ${config.workers || 'auto'}`);
    
    // Validate test data files exist
    const testDataDir = path.join(process.cwd(), 'src', 'data');
    const usersFile = path.join(testDataDir, 'users.json');
    const productsFile = path.join(testDataDir, 'products.json');
    
    if (!fs.existsSync(usersFile)) {
      throw new Error('Test data file not found: users.json');
    }
    
    if (!fs.existsSync(productsFile)) {
      throw new Error('Test data file not found: products.json');
    }
    
    logger.info('Test data files validated');
    logger.info('Global setup completed successfully');
    
  } catch (error) {
    logger.error('Global setup failed:', error instanceof Error ? error : new Error(String(error)));
    throw error; // Re-throw to fail the test run
  }
}

export default globalSetup;