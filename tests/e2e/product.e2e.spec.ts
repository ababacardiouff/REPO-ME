import { expect, test } from "@playwright/test";

test("Product page shows info and buy", async ({ page }) => {
  await page.goto("http://localhost:3000/eats/product/EATS-TEST-001");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.getByText("Buy Now")).toBeVisible();
});
