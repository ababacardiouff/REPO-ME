import request from "supertest";
import { app } from "../src";

describe("profile API", () => {
  it("retrieves a profile", async () => {
    const response = await request(app).get("/profiles/00000000-0000-0000-0000-000000000001");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("first_name");
  });

  it("updates profile preferences", async () => {
    const response = await request(app)
      .put("/profiles/00000000-0000-0000-0000-000000000001/preferences")
      .send({ language: "en", currency: "USD", notifications: false });

    expect(response.status).toBe(200);
    expect(response.body.preferences.language).toBe("en");
  });
});
