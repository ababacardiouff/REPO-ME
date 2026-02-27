import request from "supertest";
import app from "../src/app";

describe("Eats Product API", () => {
  it("GET /api/eats/products should return list", async () => {
    const res = await request(app).get("/api/eats/products");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
