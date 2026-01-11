import { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import { Logger } from './logger';
import * as fs from 'fs';
import * as path from 'path';

export class EnhancedTestReporter implements Reporter {
  private logger: Logger;
  private startTime: number = 0;
  private testResults: any[] = [];

  constructor() {
    this.logger = new Logger('TestReporter');
  }

  onBegin(config: any, suite: any) {
    this.startTime = Date.now();
    this.logger.info(`🚀 Starting test suite with ${suite.allTests().length} tests`);
    this.logger.info(`Environment: ${process.env.TEST_ENV || 'dev'}`);
    this.logger.info(`Workers: ${config.workers || 1}`);
  }

  onTestBegin(test: TestCase, result: TestResult) {
    this.logger.info(`▶️  Starting: ${test.title}`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const status = result.status === 'passed' ? '✅' : 
                   result.status === 'failed' ? '❌' : '⚠️';
    
    this.logger.info(`${status} ${test.title} (${result.duration}ms)`);
    
    this.testResults.push({
      title: test.title,
      file: test.location.file,
      line: test.location.line,
      status: result.status,
      duration: result.duration,
      errors: result.errors,
      retry: result.retry
    });

    if (result.status === 'failed') {
      this.logger.error(`❌ Test failed: ${test.title}`);
      result.errors.forEach(error => {
        this.logger.error(`Error: ${error.message}`);
      });
    }
  }

  onEnd(result: FullResult) {
    const duration = Date.now() - this.startTime;
    const passed = this.testResults.filter(t => t.status === 'passed').length;
    const failed = this.testResults.filter(t => t.status === 'failed').length;
    const skipped = this.testResults.filter(t => t.status === 'skipped').length;

    this.logger.info('\n📊 Test Execution Summary:');
    this.logger.info(`Total Duration: ${duration}ms`);
    this.logger.info(`✅ Passed: ${passed}`);
    this.logger.info(`❌ Failed: ${failed}`);
    this.logger.info(`⚠️  Skipped: ${skipped}`);
    this.logger.info(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(2)}%`);

    // Generate detailed report
    this.generateDetailedReport();
  }

  private generateDetailedReport() {
    const report = {
      timestamp: new Date().toISOString(),
      environment: process.env.TEST_ENV || 'dev',
      summary: {
        total: this.testResults.length,
        passed: this.testResults.filter(t => t.status === 'passed').length,
        failed: this.testResults.filter(t => t.status === 'failed').length,
        skipped: this.testResults.filter(t => t.status === 'skipped').length
      },
      tests: this.testResults,
      failedTests: this.testResults.filter(t => t.status === 'failed'),
      performance: this.generatePerformanceReport()
    };

    const reportPath = path.join(process.cwd(), 'test-results', 'enhanced-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    this.logger.info(`📋 Detailed report saved to: ${reportPath}`);
  }

  private generatePerformanceReport() {
    const durations = this.testResults.map(t => t.duration);
    return {
      average: Math.round(durations.reduce((a, b) => a + b, 0) / durations.length),
      min: Math.min(...durations),
      max: Math.max(...durations),
      slowestTests: this.testResults
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 5)
        .map(t => ({ title: t.title, duration: t.duration }))
    };
  }
}