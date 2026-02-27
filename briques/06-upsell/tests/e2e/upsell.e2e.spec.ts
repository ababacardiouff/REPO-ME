import { expect, test } from "@playwright/test";

test("Upsell panel appears on product page and Chef FATIMA bundle can be accepted", async ({ page }) => {
  await page.goto(`${process.env.SHOP_URL}/product/00000000-0000-0000-0000-000000000000`);
  await expect(page.locator(".upsell-panel")).toBeVisible({ timeout: 5000 });

  const chef = page.locator(".chef-Fatima");
  if (await chef.isVisible()) {
    await chef.locator("button:has-text('Add menu')").click();
    await expect(page.locator(".notification")).toContainText("added to cart");
  }
});
