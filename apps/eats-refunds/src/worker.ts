import axios from "axios";
import db from "./db";

async function processRefund(refundId: string) {
  const refund = await db.refund.findUnique({ where: { id: refundId } });
  if (!refund) return;

  try {
    await axios.post(
      `${process.env.MOLAM_PAY_URL}/refunds`,
      {
        refundId: refund.id,
        amount: refund.amount,
        currency: refund.currency,
        userId: refund.userId,
        orderId: refund.orderId,
        molamId: refund.molamId,
        channels: ["wave", "stripe", "internal-plugin"],
      },
      {
        headers: { Authorization: `Bearer ${process.env.MOLAM_PAY_KEY}` },
      }
    );

    await db.refund.update({ where: { id: refund.id }, data: { status: "COMPLETED" } });
  } catch {
    await db.refund.update({ where: { id: refund.id }, data: { status: "FAILED" } });
  }
}

export default processRefund;
