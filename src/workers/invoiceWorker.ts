import axios from "axios";
import { S3 } from "aws-sdk";
import { db } from "../lib/db";
import { generateInvoicePdf } from "../services/invoiceGenerator";

const s3 = new S3({
  endpoint: process.env.S3_ENDPOINT,
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  s3ForcePathStyle: true,
  signatureVersion: "v4"
});

export async function processInvoice(invoiceId: string) {
  try {
    await generateInvoicePdf(invoiceId);

    const invoice = await db.one<{ id: string; pdf_path: string; recipient_id: string }>(
      "SELECT id, pdf_path, recipient_id FROM invoices WHERE id=$1",
      [invoiceId]
    );

    if (!invoice.pdf_path) {
      throw new Error("pdf_path missing after generation");
    }

    const { Bucket, Key } = parseS3Uri(invoice.pdf_path);
    const url = s3.getSignedUrl("getObject", {
      Bucket,
      Key,
      Expires: 60 * 60 * 24 * 7
    });

    await axios.post(`${process.env.MAILER_SERVICE_URL}/send`, {
      to: await getUserEmail(invoice.recipient_id),
      subject: `Invoice ${invoice.id}`,
      body: `Bonjour, votre facture est disponible. Téléchargement: ${url}`,
      attachments: []
    });

    await db.none("UPDATE invoices SET status='SENT', updated_at=now() WHERE id=$1", [invoiceId]);
  } catch (error) {
    console.error("Invoice processing failed:", error);
    await db.none("UPDATE invoices SET status='FAILED', updated_at=now() WHERE id=$1", [invoiceId]);
    throw error;
  }
}

function parseS3Uri(uri: string) {
  const m = uri.match(/^s3:\/\/([^/]+)\/(.+)$/);
  if (!m) {
    throw new Error("Invalid S3 URI");
  }
  return { Bucket: m[1], Key: m[2] };
}

async function getUserEmail(userId: string) {
  const user = await db.one<{ email: string }>("SELECT email FROM users WHERE id=$1", [userId]);
  return user.email;
}
