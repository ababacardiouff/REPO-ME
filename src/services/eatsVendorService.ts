import { db } from "../infra/db";
import { kafka } from "../infra/kafka";
import { info } from "../infra/logger";
import { scoreVendor } from "./FatimaClient";
import { syncDocsFromMolamID } from "./containerBridge";

const producer = kafka.producer();
let producerConnected = false;

async function ensureProducer() {
  if (!producerConnected) {
    await producer.connect();
    producerConnected = true;
  }
}

export async function createVendor(userId: string, payload: any) {
  const res = await db.one(
    `INSERT INTO eats_vendors (user_id, vendor_type, business_name, primary_category, currency, country)
     VALUES($1,$2,$3,$4,$5,$6)
     RETURNING *`,
    [
      userId,
      payload.vendor_type,
      payload.business_name || {},
      payload.primary_category || null,
      payload.currency || "XOF",
      payload.country || "SN"
    ]
  );

  const fatima = await scoreVendor({ userId, vendor: res });
  await db.none(`UPDATE eats_vendors SET Fatima_score = $1 WHERE id = $2`, [fatima.score || 40, res.id]);

  await ensureProducer();
  await producer.send({
    topic: "molam.eats.onboarding",
    messages: [{ key: res.id, value: JSON.stringify({ type: "EATS_VENDOR_REGISTERED", vendor: res }) }]
  });

  return res;
}

export async function activateVendor(vendorId: string, userId: string) {
  await syncDocsFromMolamID(userId, vendorId);

  const docs = await db.manyOrNone(`SELECT doc_type FROM eats_vendor_documents WHERE vendor_id = $1`, [vendorId]);
  const types = docs.map((d: { doc_type: string }) => d.doc_type);
  const missing = ["identity", "license", "bank"].filter((t) => !types.includes(t));

  if (missing.length === 0) {
    await db.none(`UPDATE eats_vendors SET status = 'VERIFIED' WHERE id = $1`, [vendorId]);
    info("vendor activated", vendorId);
    return { activated: true };
  }

  return { activated: false, missing };
}

export async function getVendorStatus(vendorId: string) {
  return db.oneOrNone(`SELECT id, status, Fatima_score FROM eats_vendors WHERE id = $1`, [vendorId]);
}
