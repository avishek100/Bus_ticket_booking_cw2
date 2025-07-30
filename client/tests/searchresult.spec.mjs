import { test, expect } from "@playwright/test";

test.describe("Search Results Page", () => {
  const baseURL = "http://localhost:5173"; // Change based on your frontend URL
  const testStart = "Kathmandu";
  const testEnd = "Pokhara";
  const testDate = "2025-02-18";

  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}/search?start=${testStart}&end=${testEnd}&date=${testDate}`);
  });

  test("should load the search results page successfully", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText(/Search Results/i);
  });

  test("should correctly display the search criteria", async ({ page }) => {
    const url = new URL(page.url());
    expect(url.searchParams.get("start")).toBe(testStart);
    expect(url.searchParams.get("end")).toBe(testEnd);
    expect(url.searchParams.get("date")).toBe(testDate);
  });

  test("should display loading message while fetching buses", async ({ page }) => {
    await expect(page.locator("p:text('Loading search results...')")).toBeVisible();
  });

  test("should display buses if found", async ({ page }) => {
    await page.waitForSelector(".bg-white.rounded-lg.shadow-lg"); // Wait for bus cards
    const busCount = await page.locator(".bg-white.rounded-lg.shadow-lg").count();
    expect(busCount).toBeGreaterThan(0);
  });

  test("should show an error message if API request fails", async ({ page }) => {
    // Simulate API failure by blocking the request
    await page.route("**/api/v1/bus/bus-search/search", (route) => route.abort());

    await page.reload();
    await expect(page.locator(".text-red-500")).toBeVisible();
  });

  test("should display 'No buses found' message if no results exist", async ({ page }) => {
    // Simulate empty response
    await page.route("**/api/v1/bus/bus-search/search", async (route) => {
      await route.fulfill({ body: JSON.stringify({ buses: [] }) });
    });

    await page.reload();
    await expect(page.locator("p:text('No buses found')")).toBeVisible();
  });

  test("should toggle seat selection when clicking 'View Seats' button", async ({ page }) => {
    await page.waitForSelector("button:text('View Seats')");
    await page.click("button:text('View Seats')");

    await expect(page.locator(".seat-selection-container")).toBeVisible(); // Replace with correct selector

    await page.click("button:text('Hide Seats')");
    await expect(page.locator(".seat-selection-container")).not.toBeVisible(); // Replace with correct selector
  });
});
