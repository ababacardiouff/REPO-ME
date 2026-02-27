import checkoutService from "../services/checkoutService";

describe("CheckoutService", () => {
  const items = [
    { name: "Pizza", price: 10, qty: 2 },
    { name: "Drink", price: 5, qty: 1 }
  ];

  it("should process checkout with Molam Pay", async () => {
    const result = await checkoutService.processCheckout({
      userId: "USER1",
      items,
      paymentMethod: "molamPay",
      deliveryAddress: { id: "ADDR1" }
    });

    expect(result.status).toBe("SUCCESS");
    expect(result.total).toBe(31.5);
  });

  it("should process checkout with Stripe", async () => {
    const result = await checkoutService.processCheckout({
      userId: "USER2",
      items,
      paymentMethod: "stripe",
      deliveryAddress: { id: "ADDR2" }
    });

    expect(result.status).toBe("SUCCESS");
  });

  it("should process checkout with Wave", async () => {
    const result = await checkoutService.processCheckout({
      userId: "USER3",
      items,
      paymentMethod: "wave",
      deliveryAddress: { id: "ADDR3" }
    });

    expect(result.status).toBe("SUCCESS");
  });

  it("should process express 1-click", async () => {
    const result = await checkoutService.processCheckout({
      userId: "USER_EXPRESS",
      items,
      paymentMethod: "express",
      deliveryAddress: { id: "ADDR4" },
      idempotencyKey: "one-click"
    });

    const replay = await checkoutService.processCheckout({
      userId: "USER_EXPRESS",
      items,
      paymentMethod: "express",
      deliveryAddress: { id: "ADDR4" },
      idempotencyKey: "one-click"
    });

    expect(result.transactionId).toEqual(replay.transactionId);
  });

  it("should reject suspicious users by FATIMA scoring", async () => {
    await expect(
      checkoutService.processCheckout({
        userId: "SUSPECT_123",
        items,
        paymentMethod: "molamPay",
        deliveryAddress: { id: "ADDR5" }
      })
    ).rejects.toThrow("Checkout blocked by FATIMA risk scoring");
  });
});
