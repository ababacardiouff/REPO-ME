import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Molam Eats cart & search data...");

  await prisma.category.createMany({
    data: [{ name: "Pizza" }, { name: "Burgers" }, { name: "Desserts" }, { name: "Drinks" }],
    skipDuplicates: true
  });

  await prisma.product.createMany({
    data: [
      { name: "Margherita Pizza", price: 9.99, stock: 50, categoryId: 1 },
      { name: "Cheeseburger", price: 7.5, stock: 100, categoryId: 2 },
      { name: "Chocolate Cake", price: 5.0, stock: 40, categoryId: 3 },
      { name: "Fresh Orange Juice", price: 3.0, stock: 200, categoryId: 4 }
    ],
    skipDuplicates: true
  });

  await prisma.searchLog.createMany({
    data: [{ query: "Pizza", results: 10 }, { query: "Burger", results: 8 }, { query: "Juice", results: 5 }, { query: "Cake", results: 7 }],
    skipDuplicates: true
  });

  await prisma.cart.createMany({
    data: [
      { userId: "user-1", items: [{ id: "prod-1", qty: 2 }], status: "active" },
      { userId: "user-2", items: [{ id: "prod-2", qty: 1 }], status: "active" },
      { userId: "user-3", items: [{ id: "prod-3", qty: 1 }], status: "active" }
    ]
  });

  console.log("✅ Seed completed!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
