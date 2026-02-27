import { listPlans } from "../src/services/vendorPlans.service";

describe("Vendor Plans Service - unit", () => {
  it("should list all plans", async () => {
    const plans = await listPlans();
    expect(plans.length).toBeGreaterThanOrEqual(3);
  });
});
