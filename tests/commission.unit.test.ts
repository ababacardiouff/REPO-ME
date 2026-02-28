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
    expect(store.markVendorCommissionsPaid).toHaveBeenCalledWith("v1", undefined);
  });

  it("passes payout cutoff date to balance and paid updates", async () => {
    const payoutCutoff = new Date("2025-01-01T00:00:00.000Z");
    const store: CommissionStore = {
      insertCommission: jest.fn(),
      getUnpaidVendorEarnings: jest.fn().mockResolvedValue(33),
      markVendorCommissionsPaid: jest.fn().mockResolvedValue(undefined),
      listVendorsWithUnpaidBalances: jest.fn()
    };

    const service = new CommissionService(store);

    await service.getVendorBalance("v2", payoutCutoff);
    await service.markAsPaid("v2", payoutCutoff);

    expect(store.getUnpaidVendorEarnings).toHaveBeenCalledWith("v2", payoutCutoff);
    expect(store.markVendorCommissionsPaid).toHaveBeenCalledWith("v2", payoutCutoff);
  });
});
