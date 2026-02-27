import { expect, test } from "@playwright/test";

test("vendor can create item", async ({ page }) => {
  await page.goto("https://eats.molam/admin/login");
  await page.fill("input[name=email]", "admin@molam.com");
  await page.fill("input[name=password]", "Password123!");
  await page.click("button[type=submit]");
  await page.goto("https://eats.molam/admin/menu/new");
  await page.fill("input[name=name_fr]", "Test Dish");
  await page.fill("input[name=price]", "5000");
  await page.click("button#create");
  await expect(page.locator("text=Test Dish")).toBeVisible();
});
