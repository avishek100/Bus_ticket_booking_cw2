import { test, expect } from "@playwright/test";

test.describe("Home Page Functionality", () => {
  const baseURL = "http://localhost:5173"; // Change based on your frontend URL

  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}/`);
  });

 

  test("should display the search form", async ({ page }) => {
    await expect(page.locator("form")).toBeVisible();
  });

  

  test("should allow user to select a date", async ({ page }) => {
    const today = new Date().toISOString().split("T")[0];
    await page.fill("input[type='date']", today);
    expect(await page.inputValue("input[type='date']")).toBe(today);
  });

 
});
