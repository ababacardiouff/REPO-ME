import { db } from "../infra/db";
import { kafka } from "../infra/kafka";
import { error, info } from "../infra/logger";

const consumer = kafka.consumer({ groupId: "eats-onboarding-worker" });

export async function startOnboardingWorker() {
  await consumer.connect();
  await consumer.subscribe({ topic: "molam.eats.onboarding", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const payload = JSON.parse(message.value!.toString());
        if (payload.type === "EATS_VENDOR_REGISTERED") {
          info("Processing vendor registered", payload.vendor.id);
          await db.none("UPDATE eats_vendors SET updated_at = now() WHERE id = $1", [payload.vendor.id]);
        }
      } catch (err) {
        error("onboarding worker error", err);
      }
    }
  });
}
