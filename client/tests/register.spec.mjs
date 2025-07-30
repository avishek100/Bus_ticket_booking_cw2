import { test, expect } from "@playwright/test";

test.describe("User Registration Functionality", () => {
  const baseURL = "http://localhost:5173"; // Change based on your frontend URL

  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}/register`);
  });

 

  test("should show error for password mismatch", async ({ page }) => {
    await page.fill('input[name="password"]', "Test@123");
    await page.fill('input[name="confirmPassword"]', "WrongPass");
    await page.click('button[type="submit"]');

    // Expect alert message for password mismatch
    await page.on("dialog", async (dialog) => {
      expect(dialog.message()).toContain("Passwords do not match!");
      await dialog.dismiss();
    });
  });

  test("should show error for missing required fields", async ({ page }) => {
    await page.click('button[type="submit"]');

    // Expect form validation error messages
    await expect(page.locator('input[name="fname"]:invalid')).toBeVisible();
    await expect(page.locator('input[name="lname"]:invalid')).toBeVisible();
    await expect(page.locator('input[name="email"]:invalid')).toBeVisible();
  });

  test("should show error for invalid email format", async ({ page }) => {
    await page.fill('input[name="email"]', "invalid-email");
    await page.click('button[type="submit"]');

    // Expect validation error
    await expect(page.locator('input[name="email"]:invalid')).toBeVisible();
  });


});
