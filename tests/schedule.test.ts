import request from "supertest";
import app from "../src/app";
import * as scheduleService from "../src/services/scheduleService";

describe("Schedule API", () => {
  it("rejects schedule mutation without auth", async () => {
    await request(app)
      .post("/api/schedules/restaurants/resto-1/schedule")
      .send({ timezone: "Africa/Dakar" })
      .expect(401);
  });

  it("returns availability payload", async () => {
    const spy = jest.spyOn(scheduleService, "checkAvailability").mockResolvedValue({ available: true, capacityRemaining: 3 });

    const res = await request(app)
      .post("/api/schedules/restaurants/resto-1/check-availability")
      .send({ desiredAt: "2025-10-06T10:00:00+00:00", durationMinutes: 30 })
      .expect(200);

    expect(res.body).toEqual({ available: true, capacityRemaining: 3 });
    spy.mockRestore();
  });
});
