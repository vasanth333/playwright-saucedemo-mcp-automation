export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

export class Logger {
  private static logLevel: LogLevel = LogLevel.INFO;
  private context: string;

  constructor(context: string = 'DEFAULT') {
    this.context = context;
  }

  static setLogLevel(level: LogLevel): void {
    Logger.logLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= Logger.logLevel;
  }

  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] [${this.context}] ${message}`;
  }

  error(message: string, error?: Error): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const logMessage = this.formatMessage('ERROR', message);
      console.error(logMessage);
      if (error) {
        console.error(`Stack trace: ${error.stack}`);
      }
    }
  }

  warn(message: string): void {
    if (this.shouldLog(LogLevel.WARN)) {
      const logMessage = this.formatMessage('WARN', message);
      console.warn(logMessage);
    }
  }

  info(message: string): void {
    if (this.shouldLog(LogLevel.INFO)) {
      const logMessage = this.formatMessage('INFO', message);
      console.info(logMessage);
    }
  }

  debug(message: string): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      const logMessage = this.formatMessage('DEBUG', message);
      console.debug(logMessage);
    }
  }

  step(stepNumber: number, description: string): void {
    const logMessage = this.formatMessage('STEP', `Step ${stepNumber}: ${description}`);
    console.info(logMessage);
  }

  testStart(testName: string): void {
    const logMessage = this.formatMessage('TEST', `Starting test: ${testName}`);
    console.info('='.repeat(80));
    console.info(logMessage);
    console.info('='.repeat(80));
  }

  testEnd(testName: string, status: 'PASSED' | 'FAILED' | 'SKIPPED'): void {
    const logMessage = this.formatMessage('TEST', `Test completed: ${testName} - ${status}`);
    console.info(logMessage);
    console.info('-'.repeat(80));
  }
}