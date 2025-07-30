import { test, expect } from "@playwright/test";

test.describe("Login Functionality", () => {
  const baseURL = "http://localhost:5173"; // Change to your frontend URL

  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}/login`);
  });

  test("should show validation error for empty fields", async ({ page }) => {
    await page.click('button[type="submit"]');

    await expect(page.locator('input[name="email"]:invalid')).toBeVisible();
    await expect(page.locator('input[name="password"]:invalid')).toBeVisible();
  });
});
