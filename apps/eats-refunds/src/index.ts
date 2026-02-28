import express from "express";
import bodyParser from "body-parser";
import { createRefund } from "./services/refundService";
import { generateCreditNote } from "./services/pdfService";
import { sendCreditNoteEmail } from "./services/emailService";
import { refundDuration, refundFailures, refundRequests, setupMetrics } from "./metrics";

const app = express();
app.use(bodyParser.json());
setupMetrics(app);

app.post("/api/refunds", async (req, res) => {
  const endTimer = refundDuration.startTimer();
  refundRequests.inc();

  try {
    const {
      orderId,
      userId,
      reason,
      amount,
      email,
      currency = "XOF",
      language = "fr",
      molamId,
    } = req.body;

    const refund = await createRefund(orderId, userId, reason, amount, currency, molamId, language);
    const pdfBuffer = await generateCreditNote(refund.id);
    await sendCreditNoteEmail(email, pdfBuffer);

    res.setHeader("Content-Type", "application/pdf");
    res.send(Buffer.from(pdfBuffer));
  } catch (err: any) {
    refundFailures.inc();
    res.status(500).json({ error: err.message });
  } finally {
    endTimer();
  }
});

export default app;
