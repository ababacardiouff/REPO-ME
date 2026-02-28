import { db } from "../src/lib/db";
import { processInvoice } from "../src/workers/invoiceWorker";

async function run() {
  const failed = await db.query("SELECT id FROM invoices WHERE status='FAILED'");

  for (const row of failed.rows) {
    console.log("Retrying invoice:", row.id);
    await processInvoice(row.id);
  }
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Batch retry failed:", err);
    process.exit(1);
  });
