import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const currencies = ["XOF", "USD", "EUR", "GBP", "CNY"];
const countries = ["SN", "FR", "US", "GB", "CN"];

async function main() {
  console.log("🌱 Seeding Eats Catalog with 100 restaurants & 500+ dishes...");

  for (let i = 0; i < 100; i++) {
    const country = countries[i % countries.length];
    const currency = currencies[i % currencies.length];
    const restaurant = await prisma.eatsRestaurant.create({
      data: {
        molamId: `00000000-0000-0000-0000-${String(i).padStart(12, "0")}`,
        name: { fr: `Restaurant ${i}`, en: `Restaurant ${i}` },
        slug: `restaurant-${i}-${Date.now()}`,
        description: { fr: "Cuisine locale", en: "Local cuisine" },
        country,
        currency,
        language: i % 2 === 0 ? "fr" : "en"
      }
    });

    const category = await prisma.eatsCatalogCategory.create({
      data: {
        restaurantId: restaurant.id,
        code: "main",
        name: { fr: "Plats", en: "Main" }
      }
    });

    const dishes = Array.from({ length: 5 + (i % 6) }).map((_, idx) => ({
      restaurantId: restaurant.id,
      categoryId: category.id,
      sku: `SKU-${i}-${idx}-${Date.now()}`,
      name: { fr: `Plat ${idx}`, en: `Dish ${idx}` } as Prisma.InputJsonValue,
      description: { fr: "Description", en: "Description" } as Prisma.InputJsonValue,
      price: new Prisma.Decimal(5 + idx),
      currency,
      stock: 10 + idx,
      active: true
    }));

    for (const dish of dishes) {
      await prisma.eatsCatalogItem.create({ data: dish });
    }
  }

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
