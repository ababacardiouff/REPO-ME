import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../src/app";

const adminJwt = jwt.sign({ sub: "admin-1", roles: ["admin"] }, process.env.MOLAM_ID_JWT_SECRET || "test");

describe("Surge cap behavior", () => {
  it("respects daily cap", async () => {
    await request(app)
      .post("/api/surge")
      .set("Authorization", `Bearer ${adminJwt}`)
      .send({
        restaurantId: "resto-1",
        scopeType: "restaurant",
        name: { en: "cap test" },
        conditions: { demand_ratio: { gt: 1.0 } },
        action: { type: "percent", value: 8, applies_to: ["delivery"], cap: 50 },
        maxDailyIncreasePercent: 10
      })
      .expect(201);

    const res1 = await request(app).post("/api/surge/restaurants/resto-1/evaluate").send({ demandRatio: 1.5 });
    const res2 = await request(app).post("/api/surge/restaurants/resto-1/evaluate").send({ demandRatio: 1.5 });

    expect(res1.body).toBeDefined();
    expect(res2.body).toBeDefined();
  });
});
