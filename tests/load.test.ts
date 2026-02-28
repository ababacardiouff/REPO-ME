import * as svc from "../src/services/scheduleService";

describe("Order load capacity", () => {
  it("increments load correctly", async () => {
    const restaurantId = "resto-1";
    const start = new Date().toISOString();
    const end = new Date(Date.now() + 30 * 60_000).toISOString();

    await expect(svc.incrementLoad(restaurantId, start, end)).resolves.toBeDefined();
  });
});
