import { test, expect } from "@playwright/test";

test.describe("Manage Tickets Page", () => {
  const baseURL = "http://localhost:5173"; // Change based on your frontend URL

  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}/manage-tickets`);
  });

  test("should load the Manage Tickets page successfully", async ({ page }) => {
    await expect(page.locator("h2")).toHaveText(/Search Ticket/i);
  });

  test("should display Print Ticket and Cancel Ticket buttons", async ({ page }) => {
    await expect(page.locator("button:text('Print Ticket')")).toBeVisible();
    await expect(page.locator("button:text('Cancel Ticket')")).toBeVisible();
  });

  test("should allow user to enter ticket number", async ({ page }) => {
    await page.fill('input[placeholder="Ticket Number"]', "TICKET12345");
    await expect(page.locator('input[placeholder="Ticket Number"]')).toHaveValue("TICKET12345");
  });

  test("should allow user to enter mobile number", async ({ page }) => {
    await page.fill('input[placeholder="Mobile Number"]', "9876543210");
    await expect(page.locator('input[placeholder="Mobile Number"]')).toHaveValue("9876543210");
  });

});
