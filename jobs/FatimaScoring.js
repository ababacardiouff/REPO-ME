const axios = require("axios");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const promos = await prisma.eatsPromoCodes.findMany();
  const carts = await prisma.eatsAbandonedCarts.findMany({ where: { restored: false } });

  const engineUrl = process.env.FATIMA_ENGINE_URL || "http://fatima-engine:5000";
  const { data: promoScores } = await axios.post(`${engineUrl}/api/score/promos`, { promos });
  const { data: cartScores } = await axios.post(`${engineUrl}/api/score/carts`, { carts });

  for (const p of promoScores) {
    await prisma.eatsPromoCodes.update({ where: { id: p.id }, data: { fatimaScore: Number(p.score) } });
  }

  for (const c of cartScores) {
    await prisma.eatsAbandonedCarts.update({ where: { id: c.id }, data: { probability: Number(c.probability) } });
  }

  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
