export interface Environment {
  name: string;
  baseUrl: string;
  timeout: number;
  retries: number;
  headless: boolean;
}

export const environments: Record<string, Environment> = {
  dev: {
    name: 'dev',
    baseUrl: 'https://www.saucedemo.com',
    timeout: 30000,
    retries: 1,
    headless: true
  },
  test: {
    name: 'test',
    baseUrl: 'https://www.saucedemo.com',
    timeout: 45000,
    retries: 2,
    headless: true
  }
};

export function getEnvironment(): Environment {
  const env = process.env.TEST_ENV || 'dev';
  if (!environments[env]) {
    throw new Error(`Environment ${env} not found. Available environments: ${Object.keys(environments).join(', ')}`);
  }
  return environments[env];
}