import { test, expect } from "@playwright/test";

test.describe("Checkout E2E", () => {
  test("user can complete checkout in one click", async ({ page }) => {
    await page.addInitScript(
      (token) => {
        localStorage.setItem("molam_token", token);
      },
      process.env.MOLAM_TEST_JWT || "FAKE-TOKEN",
    );

    await page.goto("http://localhost:3000/checkout");
    await expect(page.getByText("Billing address")).toBeVisible();

    if ((await page.locator("input[name='addr']").count()) === 0) {
      await page.click("text=Add address");
    }

    const payBtn = page.getByRole("button", { name: "Payer avec Molam" });
    await expect(payBtn).toBeEnabled();
    await payBtn.click();

    await expect(page).toHaveURL(/\/order\/confirmation/);
    await expect(page.getByText(/Order/)).toBeVisible();
  });

  test("fails with missing contact", async ({ request }) => {
    const token = process.env.MOLAM_TEST_JWT || "FAKE";
    const res = await request.post("/api/checkout/order", {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        items: [{ productId: "pX", quantity: 1, unitPrice: 1000 }],
        currency: "XOF",
        saveAddressAs: {
          firstName: "No",
          lastName: "Contact",
          line1: "addr",
          city: "Dakar",
          country: "Senegal",
        },
      },
    });

    expect(res.status()).toBe(400);
  });
});
