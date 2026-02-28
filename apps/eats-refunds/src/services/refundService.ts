import db from "../db";

export async function createRefund(
  orderId: string,
  userId: string,
  reason: string,
  amount: number,
  currency: string,
  molamId: string,
  language = "fr"
) {
  const refund = await db.refund.create({
    data: {
      orderId,
      userId,
      reason,
      amount,
      currency,
      molamId,
      language,
      status: "PENDING",
    },
  });

  await db.event.create({
    data: {
      type: "REFUND_CREATED",
      payload: JSON.stringify({
        ...refund,
        integrations: ["wave", "stripe", "internal-plugin"],
        fraudEngine: "FATIMA",
      }),
    },
  });

  return refund;
}
