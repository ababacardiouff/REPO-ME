import jwt from "jsonwebtoken";
import request from "supertest";

jest.mock("../src/infra/db", () => ({
  db: {
    any: jest.fn(),
    one: jest.fn(),
    oneOrNone: jest.fn()
  }
}));

import app from "../src/index";
import { db } from "../src/infra/db";

const dbMock = db as unknown as {
  any: jest.Mock;
  one: jest.Mock;
  oneOrNone: jest.Mock;
};

describe("Eats internal agents API", () => {
  const adminToken = jwt.sign({ sub: "agent-1", roles: ["ADMIN"] }, "dev-key");
  const supportToken = jwt.sign({ sub: "agent-2", roles: ["SUPPORT_CLIENT"] }, "dev-key");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rejects unauthenticated listing", async () => {
    const res = await request(app).get("/api/eats/internal/agents");
    expect(res.status).toBe(401);
  });

  it("lists agents for admin", async () => {
    dbMock.any.mockResolvedValueOnce([{ id: "a1", full_name: "Admin Eats", roles: ["ADMIN"] }]);

    const res = await request(app)
      .get("/api/eats/internal/agents")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it("creates agent for admin", async () => {
    dbMock.one.mockResolvedValueOnce({ id: "a2", full_name: "Support Dakar" });

    const res = await request(app)
      .post("/api/eats/internal/agents")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        molamId: "11111111-1111-1111-1111-111111111111",
        fullName: "Support Dakar",
        email: "support@molam.test",
        countryCode: "SN"
      });

    expect(res.status).toBe(201);
    expect(res.body.id).toBe("a2");
  });

  it("allows support to fetch roles", async () => {
    dbMock.any.mockResolvedValueOnce([{ role_code: "ADMIN" }]);

    const res = await request(app)
      .get("/api/eats/internal/roles")
      .set("Authorization", `Bearer ${supportToken}`);

    expect(res.status).toBe(200);
    expect(res.body[0].role_code).toBe("ADMIN");
  });
});
