import { db } from "../../lib/db";

export const COMMISSION_FEE_USD = 12;

export type CommissionRecord = {
  id: string;
  orderId: string;
  vendorId: string;
  commissionAmount: number;
  vendorEarning: number;
  paidOut: boolean;
  createdAt: Date;
};

export interface CommissionStore {
  insertCommission(orderId: string, vendorId: string, commissionAmount: number, vendorEarning: number): Promise<CommissionRecord>;
  getUnpaidVendorEarnings(vendorId: string): Promise<number>;
  markVendorCommissionsPaid(vendorId: string): Promise<void>;
  listVendorsWithUnpaidBalances(): Promise<string[]>;
}

export class PgCommissionStore implements CommissionStore {
  async insertCommission(
    orderId: string,
    vendorId: string,
    commissionAmount: number,
    vendorEarning: number
  ): Promise<CommissionRecord> {
    const row = await db.one<{
      id: string;
      order_id: string;
      vendor_id: string;
      commission_amount: string;
      vendor_earning: string;
      paid_out: boolean;
      created_at: Date;
    }>(
      `INSERT INTO commissions(order_id, vendor_id, commission_amount, vendor_earning)
       VALUES($1, $2, $3, $4)
       RETURNING id, order_id, vendor_id, commission_amount, vendor_earning, paid_out, created_at`,
      [orderId, vendorId, commissionAmount, vendorEarning]
    );

    return {
      id: row.id,
      orderId: row.order_id,
      vendorId: row.vendor_id,
      commissionAmount: Number(row.commission_amount),
      vendorEarning: Number(row.vendor_earning),
      paidOut: row.paid_out,
      createdAt: row.created_at
    };
  }

  async getUnpaidVendorEarnings(vendorId: string): Promise<number> {
    const row = await db.one<{ total: string }>(
      `SELECT COALESCE(SUM(vendor_earning), 0)::text AS total
       FROM commissions
       WHERE vendor_id = $1 AND paid_out = false`,
      [vendorId]
    );

    return Number(row.total);
  }

  async markVendorCommissionsPaid(vendorId: string): Promise<void> {
    await db.none(`UPDATE commissions SET paid_out = true WHERE vendor_id = $1 AND paid_out = false`, [vendorId]);
  }

  async listVendorsWithUnpaidBalances(): Promise<string[]> {
    const rows = await db.manyOrNone<{ vendor_id: string }>(
      `SELECT DISTINCT vendor_id
       FROM commissions
       WHERE paid_out = false`
    );

    return rows.map((row) => row.vendor_id);
  }
}

export function calculateCommission(orderTotal: number, commissionFee: number = COMMISSION_FEE_USD) {
  const normalizedOrderTotal = Number(orderTotal);
  if (!Number.isFinite(normalizedOrderTotal) || normalizedOrderTotal <= 0) {
    throw new Error("invalid_order_total");
  }

  const vendorEarning = Math.max(0, normalizedOrderTotal - commissionFee);

  return {
    commissionAmount: Number(commissionFee.toFixed(2)),
    vendorEarning: Number(vendorEarning.toFixed(2))
  };
}

export class CommissionService {
  constructor(private readonly store: CommissionStore) {}

  async recordCommission(orderId: string, vendorId: string, orderTotal: number) {
    const { commissionAmount, vendorEarning } = calculateCommission(orderTotal);
    return this.store.insertCommission(orderId, vendorId, commissionAmount, vendorEarning);
  }

  getVendorBalance(vendorId: string) {
    return this.store.getUnpaidVendorEarnings(vendorId);
  }

  markAsPaid(vendorId: string) {
    return this.store.markVendorCommissionsPaid(vendorId);
  }

  listVendorsWithUnpaidBalances() {
    return this.store.listVendorsWithUnpaidBalances();
  }
}
