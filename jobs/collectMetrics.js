const { PrismaClient } = require("@prisma/client");
const client = require("prom-client");

const prisma = new PrismaClient();
const registry = new client.Registry();
client.collectDefaultMetrics({ register: registry });

const promoUsage = new client.Gauge({
  name: "eats_promo_usage_total",
  help: "Total usage of promo codes",
  labelNames: ["promo_code"],
  registers: [registry]
});

const abandonedRestored = new client.Gauge({
  name: "eats_abandoned_restored_total",
  help: "Total restored abandoned carts",
  registers: [registry]
});

const checkoutConversion = new client.Gauge({
  name: "eats_checkout_conversion_rate",
  help: "Conversion rate of checkouts vs abandoned carts",
  registers: [registry]
});

async function main() {
  const promos = await prisma.eatsPromoCodes.findMany();
  promos.forEach((p) => promoUsage.set({ promo_code: p.code }, p.usedCount));

  const restored = await prisma.eatsAbandonedCarts.count({ where: { restored: true } });
  abandonedRestored.set(restored);

  const totalOrders = await prisma.eatsOrders.count();
  const totalAbandoned = await prisma.eatsAbandonedCarts.count();
  const conversionRate = totalOrders / (totalOrders + totalAbandoned || 1);
  checkoutConversion.set(conversionRate || 0);

  const gateway = new client.Pushgateway(process.env.PROM_PUSHGATEWAY || "http://localhost:9091", {}, registry);
  await gateway.pushAdd({ jobName: "eats-metrics" });
  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
