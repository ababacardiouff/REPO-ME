import {
  COMMISSION_FEE_USD,
  CommissionService,
  CommissionStore,
  calculateCommission
} from "../src/modules/commission/commission.service";

describe("CommissionService", () => {
  it("applies fixed 12 USD commission", () => {
    const result = calculateCommission(50);
    expect(result.commissionAmount).toBe(COMMISSION_FEE_USD);
    expect(result.vendorEarning).toBe(38);
  });

  it("throws for invalid totals", () => {
    expect(() => calculateCommission(0)).toThrow("invalid_order_total");
  });

  it("aggregates unpaid balances through store", async () => {
    const store: CommissionStore = {
      insertCommission: jest.fn().mockResolvedValue({
        id: "c1",
        orderId: "o1",
        vendorId: "v1",
        commissionAmount: 12,
        vendorEarning: 88,
        paidOut: false,
        createdAt: new Date()
      }),
      getUnpaidVendorEarnings: jest.fn().mockResolvedValue(120),
      markVendorCommissionsPaid: jest.fn().mockResolvedValue(undefined),
      listVendorsWithUnpaidBalances: jest.fn().mockResolvedValue(["v1"])
    };

    const service = new CommissionService(store);

    await service.recordCommission("o1", "v1", 100);
    expect(store.insertCommission).toHaveBeenCalledWith("o1", "v1", 12, 88);

    await expect(service.getVendorBalance("v1")).resolves.toBe(120);
    await service.markAsPaid("v1");
    expect(store.markVendorCommissionsPaid).toHaveBeenCalledWith("v1");
  });
});
