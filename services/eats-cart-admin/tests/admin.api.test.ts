import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../src/app";

jest.mock("../src/services/adminCartService", () => ({
  listCarts: jest.fn().mockResolvedValue([]),
  getCartDetail: jest.fn().mockResolvedValue({ id: "cart-1", eats_cart_items: [], eats_cart_schedules: [] }),
}));

const AGENT_TOKEN = jwt.sign({ sub: "agent-111", roles: ["agent_internal:shop"] }, "fake-key");

describe("Admin Cart API", () => {
  beforeAll(() => {
    process.env.MOLAM_BYPASS_JWT = "1";
  });

  it("lists carts (requires agent role)", async () => {
    const res = await request(app)
      .get("/api/admin/cart")
      .set("Authorization", `Bearer ${AGENT_TOKEN}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  it("rejects without role", async () => {
    const bad = jwt.sign({ sub: "u1", roles: [] }, "fake-key");
    const res = await request(app)
      .get("/api/admin/cart")
      .set("Authorization", `Bearer ${bad}`);

    expect(res.status).toBe(403);
  });
});
