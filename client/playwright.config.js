// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: 'tests', // directory for test files
  timeout: 30000, // Test timeout (optional)
  use: {
    browserName: 'chromium', // Choose browser (chromium, firefox, webkit)
    headless: true, // Run tests headlessly
  },
});