import { CommissionService, PgCommissionStore } from "../modules/commission/commission.service";
import { MolamPayClient } from "../services/molamPayClient";

const commissionService = new CommissionService(new PgCommissionStore());
const molamPay = new MolamPayClient();

export async function runWeeklyPayouts() {
  console.log("Starting weekly payouts...");
  const vendors = await commissionService.listVendorsWithUnpaidBalances();

  for (const vendorId of vendors) {
    const balance = await commissionService.getVendorBalance(vendorId);
    if (balance <= 0) {
      continue;
    }

    try {
      await molamPay.transfer({
        vendorId,
        amount: Number(balance.toFixed(2)),
        currency: "USD"
      });
      await commissionService.markAsPaid(vendorId);
      console.log(`Paid out ${balance.toFixed(2)} USD to ${vendorId}`);
    } catch (err) {
      console.error(`Failed payout for ${vendorId}`, err);
    }
  }
}

if (require.main === module) {
  runWeeklyPayouts().catch((err) => {
    console.error("weeklyPayouts failed", err);
    process.exit(1);
  });
}
