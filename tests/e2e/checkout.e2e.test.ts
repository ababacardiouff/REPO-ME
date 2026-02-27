import { test, expect } from "@playwright/test";

test.describe("Molam Eats Checkout E2E", () => {
  test("Standard Checkout with Molam Pay", async ({ page }) => {
    await page.goto("http://localhost:3000/checkout");
    await page.selectOption("#payment-method", "molamPay");
    await page.click("button#confirm-pay");
    await expect(page.locator(".checkout-success")).toContainText("Payment Successful");
  });

  test("Checkout with Stripe integration", async ({ page }) => {
    await page.goto("http://localhost:3000/checkout");
    await page.selectOption("#payment-method", "stripe");
    await page.click("button#confirm-pay");
    await expect(page.locator(".checkout-success")).toContainText("Payment Successful");
  });

  test("Checkout with Wave Mobile Money", async ({ page }) => {
    await page.goto("http://localhost:3000/checkout");
    await page.selectOption("#payment-method", "wave");
    await page.click("button#confirm-pay");
    await expect(page.locator(".checkout-success")).toContainText("Payment Successful");
  });

  test("Express Checkout (1-Click Wallet)", async ({ page }) => {
    await page.goto("http://localhost:3000/checkout");
    await page.click("button#express-pay");
    await expect(page.locator(".checkout-success")).toContainText("Payment Successful");
  });
});
