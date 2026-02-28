import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../src/app";
import * as holidayService from "../src/services/holidayService";

const adminJwt = jwt.sign({ sub: "admin-1", roles: ["admin"] }, process.env.MOLAM_ID_JWT_SECRET || "test");

describe("Holidays API", () => {
  it("creates holiday and computes pricing", async () => {
    const createSpy = jest.spyOn(holidayService, "createHoliday").mockResolvedValue({
      id: "h-1",
      restaurantId: "resto-1",
      scopeType: "restaurant",
      scopeValue: null,
      name: { fr: "Test", en: "Test" },
      startDate: new Date("2025-12-24"),
      endDate: new Date("2025-12-26"),
      recurringRule: null,
      isBlackout: false,
      pricingAdjustment: { type: "percent", value: 20 },
      appliesTo: ["menu_items"],
      priority: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    } as never);

    const pricingSpy = jest.spyOn(holidayService, "computeEffectivePricing").mockResolvedValue({
      isBlackout: false,
      adjustments: [{ holidayId: "h-1", appliesTo: ["menu_items"], pricingAdjustment: { type: "percent", value: 20 } }],
      holidaysCount: 1
    });

    await request(app)
      .post("/api/holidays")
      .set("Authorization", `Bearer ${adminJwt}`)
      .send({
        scopeType: "restaurant",
        restaurantId: "resto-1",
        name: { fr: "Test", en: "Test" },
        startDate: "2025-12-24",
        endDate: "2025-12-26",
        isBlackout: false,
        pricingAdjustment: { type: "percent", value: 20 },
        appliesTo: ["menu_items"]
      })
      .expect(201);

    const eff = await request(app)
      .post("/api/holidays/restaurants/resto-1/effective-pricing")
      .send({ at: "2025-12-25T12:00:00Z" })
      .expect(200);

    expect(eff.body.adjustments.length).toBeGreaterThan(0);

    createSpy.mockRestore();
    pricingSpy.mockRestore();
  });

  it("blocks orders on blackout", async () => {
    const pricingSpy = jest.spyOn(holidayService, "computeEffectivePricing").mockResolvedValue({
      isBlackout: true,
      adjustments: [],
      holidaysCount: 1
    });

    const eff = await request(app)
      .post("/api/holidays/restaurants/resto-1/effective-pricing")
      .send({ at: "2025-11-01T10:00:00Z" })
      .expect(200);

    expect(eff.body.isBlackout).toBe(true);
    pricingSpy.mockRestore();
  });
});
