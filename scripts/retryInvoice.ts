import { processInvoice } from "../src/workers/invoiceWorker";

const invoiceId = process.argv[2];
if (!invoiceId) {
  console.error("Usage: ts-node scripts/retryInvoice.ts <invoice-id>");
  process.exit(1);
}

processInvoice(invoiceId)
  .then(() => {
    console.log("Invoice reprocessed:", invoiceId);
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error retrying invoice:", err);
    process.exit(1);
  });
