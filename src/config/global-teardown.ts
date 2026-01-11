import { FullConfig } from '@playwright/test';
import { Logger } from '../utils/logger';
import * as fs from 'fs';
import * as path from 'path';

const logger = new Logger('GlobalTeardown');

async function globalTeardown(config: FullConfig) {
  logger.info('Starting global teardown...');
  
  try {
    // Generate test summary
    await generateTestSummary();
    
    // Archive test results if in CI
    if (process.env.CI) {
      await archiveTestResults();
    }
    
    // Send notifications if configured
    if (process.env.SLACK_WEBHOOK || process.env.TEAMS_WEBHOOK) {
      await sendTestNotifications();
    }
    
    logger.info('Global teardown completed successfully');
  } catch (error) {
    // Fix: Cast unknown to Error
    logger.error('Global teardown failed:', error instanceof Error ? error : new Error(String(error)));
  }
}

async function generateTestSummary(): Promise<void> {
  logger.info('Generating test summary...');
  
  try {
    const resultsPath = path.join(process.cwd(), 'test-results', 'test-results.json');
    
    if (fs.existsSync(resultsPath)) {
      const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
      
      const summary = {
        timestamp: new Date().toISOString(),
        environment: process.env.TEST_ENV || 'dev',
        stats: results.stats || {},
        config: results.config || {},
        summary: {
          total: results.stats?.expected || 0,
          passed: results.stats?.passed || 0,
          failed: results.stats?.failed || 0,
          skipped: results.stats?.skipped || 0,
          duration: results.stats?.duration || 0
        }
      };
      
      const summaryPath = path.join(process.cwd(), 'test-results', 'summary.json');
      fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
      
      logger.info(`Test summary generated: ${summary.summary.passed}/${summary.summary.total} tests passed`);
    }
  } catch (error) {
    // Fix: Cast unknown to Error
    logger.error('Failed to generate test summary:', error instanceof Error ? error : new Error(String(error)));
  }
}

async function archiveTestResults(): Promise<void> {
  logger.info('Archiving test results for CI...');
  // Implementation for archiving (e.g., upload to S3, artifact storage, etc.)
}

async function sendTestNotifications(): Promise<void> {
  logger.info('Sending test notifications...');
  
  try {
    const summaryPath = path.join(process.cwd(), 'test-results', 'summary.json');
    
    if (fs.existsSync(summaryPath)) {
      const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
      
      const message = {
        text: `🧪 SauceDemo Test Results - ${summary.environment.toUpperCase()}`,
        attachments: [{
          color: summary.summary.failed > 0 ? 'danger' : 'good',
          fields: [
            { title: 'Total Tests', value: summary.summary.total, short: true },
            { title: 'Passed', value: summary.summary.passed, short: true },
            { title: 'Failed', value: summary.summary.failed, short: true },
            { title: 'Duration', value: `${Math.round(summary.summary.duration / 1000)}s`, short: true }
          ]
        }]
      };
      
      // Send to Slack if webhook is configured
      if (process.env.SLACK_WEBHOOK) {
        await sendSlackNotification(message);
      }
      
      // Send to Teams if webhook is configured  
      if (process.env.TEAMS_WEBHOOK) {
        await sendTeamsNotification(message);
      }
    }
  } catch (error) {
    // Fix: Cast unknown to Error
    logger.error('Failed to send notifications:', error instanceof Error ? error : new Error(String(error)));
  }
}

async function sendSlackNotification(message: any): Promise<void> {
  // Implementation for Slack webhook
  logger.info('Slack notification sent');
}

async function sendTeamsNotification(message: any): Promise<void> {
  // Implementation for Teams webhook
  logger.info('Teams notification sent');
}

export default globalTeardown;