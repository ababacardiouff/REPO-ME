import request from "supertest";
import { app } from "../src";

describe("order API", () => {
  it("returns order history", async () => {
    const response = await request(app).get("/profiles/00000000-0000-0000-0000-000000000001/orders");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("returns tracking details", async () => {
    const history = await request(app).get("/profiles/00000000-0000-0000-0000-000000000001/orders");
    const orderId = history.body[0].id;

    const tracking = await request(app).get(`/orders/${orderId}/tracking`);
    expect(tracking.status).toBe(200);
    expect(tracking.body).toHaveProperty("timeline");
  });
});
