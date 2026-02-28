import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const rest = await prisma.eatsRestaurant.findFirst();
  if (!rest) {
    console.error("No restaurant found, seed restaurants first");
    return;
  }

  const schedule = await prisma.eatsSchedule.upsert({
    where: { restaurantId: rest.id },
    update: {},
    create: {
      restaurantId: rest.id,
      timezone: "Africa/Dakar",
      leadTimeMinutes: 15,
      weeklyRules: {
        create: [
          { weekday: 1, startTime: "09:00:00", endTime: "14:00:00", isOpen: true },
          { weekday: 1, startTime: "18:00:00", endTime: "22:00:00", isOpen: true }
        ]
      }
    }
  });

  console.log("Seeded schedule", schedule.id);
}

main().finally(async () => prisma.$disconnect());
