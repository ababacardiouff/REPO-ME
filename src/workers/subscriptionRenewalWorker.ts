import { db } from "../infra/db";
import { error, info } from "../infra/logger";

export function startSubscriptionRenewalWorker() {
  const run = async () => {
    try {
      const now = new Date();
      await db.none("UPDATE eats_vendor_subscriptions SET status='EXPIRED' WHERE current_period_end < $1 AND status='ACTIVE'", [now.toISOString()]);

      const soon = new Date(now);
      soon.setDate(soon.getDate() + 3);
      const soonDate = soon.toISOString().slice(0, 10);
      const rows = await db.manyOrNone(
        "SELECT vendor_id, payment_subscription_id FROM eats_vendor_subscriptions WHERE current_period_end::date = $1::date",
        [soonDate]
      );
      info("renewal worker processed", rows.length);
    } catch (err) {
      error("renewal worker error", err);
    }
  };

  void run();
  setInterval(() => {
    void run();
  }, 24 * 60 * 60 * 1000);
}
