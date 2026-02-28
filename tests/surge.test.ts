import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../src/app";

const adminJwt = jwt.sign({ sub: "admin-1", roles: ["admin"] }, process.env.MOLAM_ID_JWT_SECRET || "test");

describe("Surge Rules API", () => {
  it("creates and evaluates a surge rule", async () => {
    await request(app)
      .post("/api/surge")
      .set("Authorization", `Bearer ${adminJwt}`)
      .send({
        restaurantId: "resto-1",
        scopeType: "restaurant",
        name: { en: "High Demand" },
        conditions: { demand_ratio: { gt: 1.3 } },
        action: { type: "percent", value: 25, applies_to: ["delivery"], cap: 50 }
      })
      .expect(201);

    const evalRes = await request(app)
      .post("/api/surge/restaurants/resto-1/evaluate")
      .send({ at: new Date().toISOString(), demandRatio: 1.5, queueLength: 12 })
      .expect(200);

    expect(Array.isArray(evalRes.body.adjustments)).toBe(true);
  });
});
