import { Router } from "express";
import { S3 } from "aws-sdk";
import { db } from "../lib/db";
import { requireRole, verifyJwt } from "../lib/auth";
import { processInvoice } from "../workers/invoiceWorker";

const router = Router();

const s3 = new S3({
  endpoint: process.env.S3_ENDPOINT,
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  s3ForcePathStyle: true,
  signatureVersion: "v4"
});

router.post("/create", verifyJwt, async (req, res) => {
  const { orderId, tenantId, issuerId, recipientId, currency, totalAmount, taxAmount, language } = req.body;

  const invoice = await db.one<{ id: string }>(
    `INSERT INTO invoices(order_id, tenant_id, issuer_id, recipient_id, currency, total_amount, tax_amount, language)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
    [orderId, tenantId, issuerId, recipientId, currency, totalAmount, taxAmount || 0, language || "fr"]
  );

  processInvoice(invoice.id).catch((err) => console.error("async invoice generation error", err));

  res.json({ status: "accepted", invoiceId: invoice.id });
});

router.get("/:invoiceId/download", verifyJwt, async (req, res) => {
  const invoice = await db.oneOrNone<any>("SELECT * FROM invoices WHERE id=$1", [req.params.invoiceId]);
  if (!invoice) {
    return res.status(404).json({ error: "not_found" });
  }

  const user = (req as any).user;
  if (!canAccessInvoice(user, invoice)) {
    return res.status(403).json({ error: "forbidden" });
  }

  if (!invoice.pdf_path) {
    return res.status(404).json({ error: "pdf_missing" });
  }

  const { Bucket, Key } = parseS3Uri(invoice.pdf_path);
  const url = s3.getSignedUrl("getObject", { Bucket, Key, Expires: 60 * 60 });
  return res.json({ url });
});

router.post("/:invoiceId/resend", verifyJwt, requireRole("ops:billing"), async (req, res) => {
  processInvoice(req.params.invoiceId).catch((err) => console.error("resend error", err));
  res.json({ status: "resend_queued" });
});

function parseS3Uri(uri: string) {
  const m = uri.match(/^s3:\/\/([^/]+)\/(.+)$/);
  if (!m) {
    throw new Error("invalid_s3_uri");
  }
  return { Bucket: m[1], Key: m[2] };
}

function canAccessInvoice(user: any, invoice: any) {
  if (user.roles?.includes("admin")) return true;
  if (user.id === invoice.recipient_id) return true;
  if (user.id === invoice.issuer_id) return true;
  if (user.tenant_id && user.tenant_id === invoice.tenant_id && user.roles?.includes("tenant:staff")) return true;
  return false;
}

export default router;
