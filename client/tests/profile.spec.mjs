import { test, expect } from "@playwright/test";

test.describe("Profile Page Functionality", () => {
  const baseURL = "http://localhost:5173"; // Change based on your frontend URL

  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}/profile`);
  });

  test("should load the profile page successfully", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText(/Profile Settings/i);
  });

  test("should display prefilled user information", async ({ page }) => {
    await expect(page.locator('input[name="name"]')).toHaveValue("John Doe");
    await expect(page.locator('input[name="email"]')).toHaveValue("john.doe@example.com");
    await expect(page.locator('input[name="password"]')).toHaveValue("********");
  });

  test("should enable input fields when clicking Edit Profile", async ({ page }) => {
    await page.click("button:text('Edit Profile')");

    await expect(page.locator('input[name="name"]')).not.toBeDisabled();
    await expect(page.locator('input[name="email"]')).not.toBeDisabled();
    await expect(page.locator('input[name="password"]')).not.toBeDisabled();
  });

  test("should allow editing the user profile", async ({ page }) => {
    await page.click("button:text('Edit Profile')");
    await page.fill('input[name="name"]', "Jane Doe");
    await page.fill('input[name="email"]', "jane.doe@example.com");
    await page.fill('input[name="password"]', "NewPassword123");

    await page.click("button:text('Save Changes')");

    await expect(page.locator("div.text-green-700")).toHaveText(/Profile updated successfully!/i);
  });


  test("should disable input fields after saving changes", async ({ page }) => {
    await page.click("button:text('Edit Profile')");
    await page.click("button:text('Save Changes')");

    await expect(page.locator('input[name="name"]')).toBeDisabled();
    await expect(page.locator('input[name="email"]')).toBeDisabled();
    await expect(page.locator('input[name="password"]')).toBeDisabled();
  });

  test("should show success message after updating profile", async ({ page }) => {
    await page.click("button:text('Edit Profile')");
    await page.click("button:text('Save Changes')");

    await expect(page.locator("div.text-green-700")).toHaveText(/Profile updated successfully!/i);
  });
});
