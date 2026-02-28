import PDFDocument from "pdfkit";
import db from "../db";

const i18n: Record<string, { title: string; reason: string; date: string; amount: string }> = {
  fr: {
    title: "Molam Eats - Note de Crédit",
    reason: "Motif",
    date: "Date",
    amount: "Montant",
  },
  en: {
    title: "Molam Eats - Credit Note",
    reason: "Reason",
    date: "Date",
    amount: "Amount",
  },
};

export async function generateCreditNote(refundId: string) {
  const refund = await db.refund.findUnique({
    where: { id: refundId },
    include: { order: true },
  });

  if (!refund) throw new Error("Refund not found");

  const lang = i18n[refund.language] ? refund.language : "fr";
  const labels = i18n[lang];

  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const chunks: Buffer[] = [];

  doc.on("data", (chunk) => chunks.push(chunk));

  doc.fontSize(20).text(labels.title, { align: "left" });
  doc.moveDown();
  doc.fontSize(12).text(`Molam ID: ${refund.molamId}`);
  doc.text(`ID Remboursement: ${refund.id}`);
  doc.text(`Commande: ${refund.orderId}`);
  doc.text(`Utilisateur: ${refund.userId}`);
  doc.text(`${labels.amount}: ${refund.amount.toFixed(2)} ${refund.currency || refund.order.currency}`);
  doc.text(`${labels.reason}: ${refund.reason}`);
  doc.text(`${labels.date}: ${new Date().toISOString()}`);

  doc.end();

  return await new Promise<Uint8Array>((resolve, reject) => {
    doc.on("end", () => resolve(new Uint8Array(Buffer.concat(chunks))));
    doc.on("error", reject);
  });
}
