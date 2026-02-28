import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../src/index";

jest.mock("../src/services/userService", () => ({
  findOrCreateEatsUser: jest.fn(async () => ({
    id: "eats-user-id",
    molamId: "00000000-0000-0000-0000-000000000001",
    country: "SN",
    currency: "XOF",
    language: "fr",
  })),
  getEatsUserProfile: jest.fn(async () => ({
    id: "eats-user-id",
    molamId: "00000000-0000-0000-0000-000000000001",
    addresses: [],
  })),
  updateEatsUser: jest.fn(),
  listUserAddresses: jest.fn(async () => []),
  createAddress: jest.fn(),
}));

jest.mock("../src/services/eventService", () => ({
  enqueueEvent: jest.fn(async () => undefined),
}));

const molamJwt = jwt.sign(
  {
    sub: "00000000-0000-0000-0000-000000000001",
    email: "user@example.com",
    given_name: "Test",
    family_name: "User",
    country: "SN",
    locale: "fr",
    currency: "XOF",
  },
  process.env.MOLAM_ID_JWT_SECRET || "testsecret"
);

describe("Eats Particulier API", () => {
  it("activates a user account in one click", async () => {
    const res = await request(app)
      .post("/accounts/activate")
      .set("Authorization", `Bearer ${molamJwt}`)
      .expect(200);

    expect(res.body.status).toBe("ok");
    expect(res.body.user.molamId).toBe("00000000-0000-0000-0000-000000000001");
  });

  it("returns profile", async () => {
    const res = await request(app)
      .get("/accounts/me")
      .set("Authorization", `Bearer ${molamJwt}`)
      .expect(200);

    expect(res.body.molamId).toBe("00000000-0000-0000-0000-000000000001");
  });
});
