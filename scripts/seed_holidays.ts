import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const restaurant = await prisma.eatsRestaurant.findFirst();
  if (!restaurant) return;

  await prisma.eatsHoliday.create({
    data: {
      restaurantId: restaurant.id,
      scopeType: "restaurant",
      name: { en: "Christmas", fr: "Noël" },
      startDate: new Date("2025-12-24"),
      endDate: new Date("2025-12-26"),
      recurringRule: "FREQ=YEARLY;BYMONTH=12;BYMONTHDAY=25",
      isBlackout: false,
      pricingAdjustment: { type: "percent", value: 20 },
      appliesTo: ["menu_items", "delivery"],
      priority: 5
    }
  });
}

main().finally(async () => prisma.$disconnect());
