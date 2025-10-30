import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  globalSetup: './global-setup.js',
  use: {
    storageState: 'storageState.json',
    baseURL: 'http://localhost:3000',
  },
});
