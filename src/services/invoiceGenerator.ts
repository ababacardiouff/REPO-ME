import { S3 } from "aws-sdk";
import i18next from "i18next";
import PDFDocument from "pdfkit";
import { db } from "../lib/db";

type InvoiceRow = {
  id: string;
  order_id: string;
  tenant_id: string;
  recipient_id: string;
  issuer_id: string;
  currency: string;
  total_amount: number;
  tax_amount: number;
  language: string;
};

const s3 = new S3({
  endpoint: process.env.S3_ENDPOINT,
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  s3ForcePathStyle: true,
  signatureVersion: "v4"
});

export async function generateInvoicePdf(invoiceId: string) {
  const invoice = await db.oneOrNone<InvoiceRow>("SELECT * FROM invoices WHERE id=$1", [invoiceId]);
  if (!invoice) {
    throw new Error("Invoice not found");
  }

  const order = await db.one<{ id: string }>("SELECT id FROM orders WHERE id=$1", [invoice.order_id]);
  const buyer = await db.one<{ first_name: string; last_name: string; email: string; lang?: string }>(
    "SELECT first_name, last_name, email, lang FROM users WHERE id=$1",
    [invoice.recipient_id]
  );
  const issuer = await db.one<{ business_name: string }>(
    "SELECT business_name FROM vendors WHERE id=$1",
    [invoice.issuer_id]
  );

  const lang = invoice.language || buyer.lang || "fr";
  await i18next.changeLanguage(lang);

  const pdfBuffer = await buildPdf(order.id, buyer, issuer.business_name, invoice, lang);
  const key = `invoices/${invoice.tenant_id}/${invoiceId}.pdf`;

  await s3
    .putObject({
      Bucket: process.env.INVOICES_BUCKET || "molam-shop-invoices",
      Key: key,
      Body: pdfBuffer,
      ContentType: "application/pdf",
      ServerSideEncryption: process.env.S3_SSE || undefined
    })
    .promise();

  await db.none("UPDATE invoices SET pdf_path=$1, status='GENERATED', updated_at=now() WHERE id=$2", [
    `s3://${process.env.INVOICES_BUCKET || "molam-shop-invoices"}/${key}`,
    invoiceId
  ]);
}

async function buildPdf(
  orderId: string,
  buyer: { first_name: string; last_name: string; email: string },
  businessName: string,
  invoice: InvoiceRow,
  lang: string
): Promise<Buffer> {
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const buffers: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => buffers.push(chunk));

  doc.fontSize(14).text(i18next.t("invoice.title", { defaultValue: "Invoice / Facture" }), { align: "center" });
  doc.moveDown();
  doc.fontSize(10).text(`${i18next.t("invoice.issuer")}: ${businessName}`);
  doc.text(`${i18next.t("invoice.date")}: ${new Date().toLocaleString(lang)}`);
  doc.moveDown();
  doc.text(`${i18next.t("invoice.recipient")}: ${buyer.first_name} ${buyer.last_name}`);
  doc.text(`${i18next.t("invoice.email")}: ${buyer.email}`);
  doc.moveDown();

  const items = await db.manyOrNone<{ product_name: string; qty: number; unit_price: number }>(
    "SELECT product_name, qty, unit_price FROM order_items WHERE order_id=$1",
    [orderId]
  );
  doc.text(i18next.t("invoice.items_header"));
  for (const item of items) {
    doc.text(`${item.product_name} — ${item.qty} x ${formatMoney(item.unit_price, invoice.currency, lang)}`);
  }

  doc.moveDown();
  doc.text(
    `${i18next.t("invoice.subtotal")}: ${formatMoney(invoice.total_amount - invoice.tax_amount, invoice.currency, lang)}`
  );
  doc.text(`${i18next.t("invoice.tax")}: ${formatMoney(invoice.tax_amount, invoice.currency, lang)}`);
  doc.text(`${i18next.t("invoice.total")}: ${formatMoney(invoice.total_amount, invoice.currency, lang)}`);
  doc.end();

  return await new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
  });
}

function formatMoney(amount: number, currency: string, lang: string) {
  return new Intl.NumberFormat(lang, { style: "currency", currency }).format(amount);
}
