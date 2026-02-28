import request from "supertest";
import app from "../src/app";

describe("Ops AB Config API", () => {
  it("rejects invalid mode", async () => {
    const res = await request(app).post("/api/ops/ab-config").send({ mode: "Z" });
    expect(res.status).toBe(400);
  });
});
