import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.eatsPromoCodes.createMany({
    data: [
      {
        code: "WELCOME10",
        description: "10% sur votre première commande",
        discount: 10,
        maxUsage: 1000,
        validFrom: new Date(),
        validTo: new Date(new Date().setMonth(new Date().getMonth() + 3)),
        active: true
      },
      {
        code: "FESTIVE20",
        description: "20% pour les fêtes",
        discount: 20,
        maxUsage: 500,
        validFrom: new Date(),
        validTo: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        active: true
      }
    ],
    skipDuplicates: true
  });
  console.log("Promo codes seeded");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
