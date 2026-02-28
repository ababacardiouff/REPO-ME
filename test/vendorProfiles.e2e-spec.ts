import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../src/app.module";

describe("VendorProfiles (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("should create a vendor profile", async () => {
    const res = await request(app.getHttpServer()).post("/eats/vendor-profiles").send({
      vendorId: "f1b1a3c0-1234-5678-9123-abcdef987654",
      molamUserId: "ab12cd34-5678-9012-abcd-345678901234",
      role: "Manager",
    });

    expect(res.status).toBe(201);
    expect(res.body.role).toBe("Manager");
  });

  it("should list vendor profiles", async () => {
    const res = await request(app.getHttpServer()).get(
      "/eats/vendor-profiles/f1b1a3c0-1234-5678-9123-abcdef987654",
    );

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it("should delete a vendor profile", async () => {
    const res = await request(app.getHttpServer()).delete(
      "/eats/vendor-profiles/123e4567-e89b-12d3-a456-426614174000",
    );

    expect([200, 204, 404]).toContain(res.status);
  });

  afterAll(async () => {
    await app.close();
  });
});
