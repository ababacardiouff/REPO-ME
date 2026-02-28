import { expect, test } from "@playwright/test";

test("Vendor Profiles Page", async ({ page }: { page: any }) => {
  await page.goto("/vendor/profiles");

  await page.click("text=+ Add Profile");
  await page.fill("input", "ab12cd34-5678-9012-abcd-345678901234");
  await page.selectOption("select", "Manager");
  await page.click("button:has-text('Save')");

  const role = await page.textContent("tbody tr:first-child td:nth-child(2)");
  expect(role).toBe("Manager");
});
