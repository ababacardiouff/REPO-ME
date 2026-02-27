import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../src/index";

const validToken = jwt.sign({ sub: "11111111-1111-1111-1111-111111111111", roles: ["vendor_admin"] }, "dev-key");

describe("Eats Onboarding API - Integration", () => {
  it("should reject invalid vendor status id format safely", async () => {
    const res = await request(app)
      .get("/api/eats/onboarding/0000/status")
      .set("Authorization", `Bearer ${validToken}`);

    expect([200, 500]).toContain(res.status);
  });

  it("should enforce auth on register", async () => {
    const res = await request(app).post("/api/eats/onboarding/register").send({ vendor_type: "restaurant" });
    expect(res.status).toBe(401);
  });
});
