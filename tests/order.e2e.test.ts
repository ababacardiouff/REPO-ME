import request from "supertest";
import app from "../src/app";
import jwt from "jsonwebtoken";

describe("Orders API", () => {
  const token = jwt.sign({ sub: "u1", roles: [] }, "dev-key");

  it("rejects empty items", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({ items: [] });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("No items provided");
  });
});
