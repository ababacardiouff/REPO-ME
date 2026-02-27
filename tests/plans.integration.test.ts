import request from "supertest";
import app from "../src/index";

describe("Vendor Plans Service - integration", () => {
  it("should return health", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
