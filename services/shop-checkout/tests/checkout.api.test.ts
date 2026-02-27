import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../src/app";

const USER_TOKEN = jwt.sign({ sub: "user-111", roles: ["user"] }, "fake-key");

describe("Checkout API", () => {
  it("rejects order without address", async () => {
    const res = await request(app)
      .post("/api/checkout/order")
      .set("Authorization", `Bearer ${USER_TOKEN}`)
      .send({ items: [{ productId: "p1", quantity: 1, unitPrice: 100 }], currency: "XOF" });
    expect(res.status).toBe(400);
  });

  it("saves address and creates order one-click", async () => {
    const addr = await request(app)
      .post("/api/checkout/addresses")
      .set("Authorization", `Bearer ${USER_TOKEN}`)
      .send({
        firstName: "Jane",
        lastName: "Doe",
        phone: "+221770000001",
        line1: "addr",
        city: "Dakar",
        country: "Senegal",
      });
    expect(addr.status).toBe(200);

    const res = await request(app)
      .post("/api/checkout/order")
      .set("Authorization", `Bearer ${USER_TOKEN}`)
      .send({
        addressId: addr.body.id,
        items: [{ productId: "p1", quantity: 1, unitPrice: 500 }],
        currency: "XOF",
        idempotencyKey: "test-key-1",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id");
  });
});
