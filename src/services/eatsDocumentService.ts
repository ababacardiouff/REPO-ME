import { db } from "../infra/db";
import { info } from "../infra/logger";

export async function addVendorDocument(vendorId: string, docType: string, fileUrl: string, uploadedBy: string) {
  await db.none(
    `INSERT INTO eats_vendor_documents (vendor_id, doc_type, file_url, storage_provider, status, uploaded_by)
     VALUES($1,$2,$3,$4,$5,$6)`,
    [vendorId, docType, fileUrl, "s3", "UPLOADED", uploadedBy]
  );

  info("document added", vendorId, docType);
}

export async function getVendorDocs(vendorId: string) {
  return db.manyOrNone(
    `SELECT id, doc_type, file_url, status, uploaded_at FROM eats_vendor_documents WHERE vendor_id = $1`,
    [vendorId]
  );
}
