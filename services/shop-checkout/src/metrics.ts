import client from "prom-client";

export const ordersCreated = new client.Counter({
  name: "shop_orders_created_total",
  help: "Total orders created",
});

export const ordersPaid = new client.Counter({
  name: "shop_orders_paid_total",
  help: "Total orders paid",
});

export const ordersPaymentFailures = new client.Counter({
  name: "shop_order_payment_failures_total",
  help: "Payment failures",
});

export const checkoutLatency = new client.Histogram({
  name: "shop_checkout_latency_seconds",
  help: "Checkout end-to-end latency",
  buckets: [0.1, 0.3, 0.5, 1, 2, 5],
});

export function registerMetrics(app: any) {
  app.get("/metrics", async (_: any, res: any) => {
    res.set("Content-Type", client.register.contentType);
    res.send(await client.register.metrics());
  });
}
