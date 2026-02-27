import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const allergens = [
    { code: "GLUTEN", name: { fr: "Gluten", en: "Gluten" } },
    { code: "NUTS", name: { fr: "Fruits à coque", en: "Nuts" } },
    { code: "DAIRY", name: { fr: "Produits laitiers", en: "Dairy" } }
  ];

  for (const a of allergens) {
    await prisma.eatsAllergen.upsert({
      where: { code: a.code },
      update: {},
      create: a
    });
  }

  const cat = await prisma.eatsMenuCategory.upsert({
    where: { code: "meals" },
    update: {},
    create: {
      vendorId: "00000000-0000-0000-0000-000000000000",
      code: "meals",
      name: { fr: "Plats", en: "Meals" }
    }
  });

  const item = await prisma.eatsMenuItem.create({
    data: {
      vendorId: "00000000-0000-0000-0000-000000000000",
      categoryId: cat.id,
      skuCode: `MEAL-001-${Date.now()}`,
      name: { fr: "Poulet Yassa", en: "Yassa Chicken" },
      description: { fr: "Poulet mariné", en: "Marinated chicken" },
      defaultPriceCents: BigInt(5000),
      currency: "XOF",
      images: [{ url: "https://cdn.example.com/yassa.jpg", alt: { fr: "Poulet Yassa", en: "Yassa Chicken" } }]
    }
  });

  await prisma.eatsMenuSku.create({
    data: {
      itemId: item.id,
      skuCode: `MEAL-001-S-${Date.now()}`,
      priceCents: BigInt(5000),
      stock: 50,
      attributes: { portion: "standard" }
    }
  });


  const product = await prisma.eatsProduct.upsert({
    where: { skuCode: "EATS-TEST-001" },
    update: {},
    create: {
      vendorId: "00000000-0000-0000-0000-000000000000",
      skuCode: "EATS-TEST-001",
      name: { fr: "Sandwich Thon", en: "Tuna Sandwich" },
      description: { fr: "Sandwich classique", en: "Classic tuna sandwich" },
      images: [{ url: "https://cdn.molam.com/eats/sandwich.jpg", alt: { fr: "Sandwich Thon", en: "Tuna Sandwich" } }],
      priceCents: BigInt(2500),
      currency: "XOF",
      country: "SN",
      stock: 100,
      isAvailable: true
    }
  });

  await prisma.eatsProductVariant.createMany({
    data: [
      {
        productId: product.id,
        variantCode: "EATS-TEST-001-S",
        attributes: { size: "small" },
        priceCents: BigInt(2000),
        stock: 50
      },
      {
        productId: product.id,
        variantCode: "EATS-TEST-001-L",
        attributes: { size: "large" },
        priceCents: BigInt(3000),
        stock: 50
      }
    ],
    skipDuplicates: true
  });

  console.log("Seed done");
}

main().finally(async () => {
  await prisma.$disconnect();
});
