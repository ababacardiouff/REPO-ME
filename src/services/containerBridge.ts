import axios from "axios";
import { db } from "../infra/db";

export async function syncDocsFromMolamID(userId: string, vendorId: string) {
  const molamIdUrl = process.env.MOLAM_ID_URL || "http://molam-id.internal";
  const token = process.env.MOLAM_ID_TOKEN || "";

  const resp = await axios.get(`${molamIdUrl}/v1/users/${userId}/documents`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const docs = (resp.data || []) as Array<{ type: string; url: string; provider?: string }>;

  for (const d of docs) {
    await db.none(
      `INSERT INTO eats_vendor_documents (vendor_id, doc_type, file_url, storage_provider, status, uploaded_by)
       VALUES($1,$2,$3,$4,$5,$6)
       ON CONFLICT DO NOTHING`,
      [vendorId, d.type, d.url, d.provider || "molam-id", "VERIFIED", userId]
    );
  }

  return { synced: docs.length };
}
