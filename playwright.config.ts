import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/seo', fullyParallel: false, workers: 1, timeout: 45_000,
  reporter: 'list', outputDir: 'test-results',
  use: { baseURL: 'http://127.0.0.1:3100', channel: process.env.CI ? undefined : 'chrome', headless: true, screenshot: 'only-on-failure' },
  webServer: { command: 'npm run start -- --hostname 127.0.0.1 --port 3100', url: 'http://127.0.0.1:3100', reuseExistingServer: false, timeout: 60_000 },
});
