import request from "supertest";
import { app } from "../src";

describe("payment API", () => {
  it("creates and removes payment method", async () => {
    const userId = "00000000-0000-0000-0000-000000000011";
    const createResponse = await request(app)
      .post(`/profiles/${userId}/payments`)
      .send({ provider: "MolamPay", token: "tok_test", last4: "1234" });

    expect(createResponse.status).toBe(201);

    const removeResponse = await request(app)
      .delete(`/profiles/${userId}/payments/${createResponse.body.id}`);

    expect(removeResponse.status).toBe(204);
  });
});
