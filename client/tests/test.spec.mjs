import { test, expect } from '@playwright/test';

test('homepage has title', async ({ page }) => {
  await page.goto('http://localhost:5173'); // Replace with your app's URL
  await expect(page).toHaveTitle(/Vite \+ React/); // Remove extra quotes
});
