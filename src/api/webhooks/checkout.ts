import { Router } from "express";
import axios from "axios";

const router = Router();

router.post("/molam-pay", async (req, res) => {
  const payload = req.body;

  if (payload.event === "payment.succeeded") {
    const order = payload.order;
    await axios.post(
      `${process.env.SHOP_API_URL}/api/invoices/create`,
      {
        orderId: order.id,
        tenantId: order.tenant_id,
        issuerId: order.vendor_id,
        recipientId: order.buyer_id,
        currency: order.currency,
        totalAmount: order.total_amount,
        taxAmount: order.tax_amount,
        language: order.locale || "fr"
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.SERVICE_TO_SERVICE_TOKEN}`
        }
      }
    );
  }

  res.json({ ok: true });
});

export default router;
