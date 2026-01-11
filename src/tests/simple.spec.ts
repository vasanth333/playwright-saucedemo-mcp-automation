import { test, expect } from '@playwright/test';

test('Simple arithmetic test', async () => {
  expect(2 + 2).toBe(4);
});