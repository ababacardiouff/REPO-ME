import { prisma } from "../src/lib/prisma.js";
import { processPayment } from "../src/infra/paymentGateway.js";

async function main() {
  const failedOrders = await prisma.shop_orders.findMany({ where: { status: "FAILED" }, take: 100 });
  console.log(`Found ${failedOrders.length} failed orders`);

  for (const o of failedOrders) {
    try {
      const resp = await processPayment({
        orderId: o.id,
        userId: o.user_id,
        amount: Number(o.total_amount),
        currency: o.currency,
        description: `Retry Order ${o.id}`,
        idempotencyKey: o.idempotency_key,
      });
      await prisma.shop_orders.update({
        where: { id: o.id },
        data: { status: "PAID", payment_provider: resp.provider, payment_reference: resp.reference },
      });
      console.log(`Replayed order ${o.id} ok`);
    } catch (err) {
      console.error(`Order ${o.id} still failing: ${(err && err.message) || "unknown"}`);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
