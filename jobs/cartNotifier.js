const axios = require("axios");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const variants = ["A", "B", "C"];

function assignVariant(mode) {
  if (mode !== "random") return mode;
  return variants[Math.floor(Math.random() * variants.length)];
}

async function main() {
  const config = (await prisma.eatsABConfig.findFirst()) || (await prisma.eatsABConfig.create({ data: { forcedMode: "random" } }));
  const carts = await prisma.eatsAbandonedCarts.findMany({
    where: { restored: false, probability: { gte: 0.6 }, notified: false }
  });

  for (const cart of carts) {
    const variant = assignVariant(config.forcedMode);
    const body = `Hi, your cart is waiting (${variant})`;

    await axios.post("http://molam-talk-service/push", {
      userId: cart.userId,
      type: "cart_reminder",
      payload: { cartId: cart.id, message: body }
    });

    await prisma.eatsAbandonedCarts.update({
      where: { id: cart.id },
      data: { notified: true, variant }
    });
  }

  await prisma.$disconnect();
}

module.exports = { assignVariant };

if (require.main === module) {
  main().catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
}
