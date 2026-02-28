const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const threshold = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);
  const deleted = await prisma.eatsAbandonedCarts.deleteMany({
    where: { createdAt: { lt: threshold }, restored: false }
  });
  console.log(`cleaned ${deleted.count} carts`);
  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
