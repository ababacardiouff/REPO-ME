import { Router } from "express";
import db from "../db";
import { eatsProductBuyNowTotal } from "../infra/metrics";
import { kafkaProducer } from "../infra/kafka";

const router = Router();

async function createCheckout(req: any, res: any) {
  const { productId, skuId, buyerId, amountCents, currency } = req.body;
  const r = await db.query(
    "INSERT INTO eats_orders_snapshot (vendor_id, product_id, sku_id, buyer_id, order_amount_cents, currency) SELECT vendor_id,$1,$2,$3,$4,$5 FROM eats_products WHERE id=$1 RETURNING *",
    [productId, skuId || null, buyerId || null, amountCents, currency]
  );

  const order = r.rows[0];
  if (!order) {
    return res.status(404).json({ error: "product_not_found" });
  }

  await db.query(
    "INSERT INTO eats_outbox (aggregate_type, aggregate_id, event_type, payload) VALUES('order',$1,'created',$2)",
    [order.id, JSON.stringify(order)]
  );

  eatsProductBuyNowTotal.inc({ product_id: String(productId || "unknown") }, 1);
  await kafkaProducer.send({
    topic: "molam.eats.order.created",
    messages: [{ key: order.id, value: JSON.stringify(order) }]
  });

  return res.json(order);
}

router.post("/", createCheckout);
router.post("/buy", createCheckout);

export default router;
