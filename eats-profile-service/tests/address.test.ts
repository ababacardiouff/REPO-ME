import request from "supertest";
import { app } from "../src";

describe("address API", () => {
  it("creates and lists an address", async () => {
    const userId = "00000000-0000-0000-0000-000000000010";
    const createResponse = await request(app)
      .post(`/profiles/${userId}/addresses`)
      .send({ label: "Home", street: "Rue 10", city: "Dakar", country: "Senegal" });

    expect(createResponse.status).toBe(201);

    const listResponse = await request(app).get(`/profiles/${userId}/addresses`);
    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toHaveLength(1);
  });
});
