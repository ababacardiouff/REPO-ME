import { PrismaClient } from "@prisma/client";
import { publishEvent } from "../services/eventBus";

const prisma = new PrismaClient();

async function run() {
  const target = new Date();
  target.setUTCHours(0, 0, 0, 0);
  target.setUTCDate(target.getUTCDate() + 2);

  const holidays = await prisma.eatsHoliday.findMany({ where: { startDate: { equals: target } } });
  for (const holiday of holidays) {
    await publishEvent("eats.holiday.upcoming", {
      id: holiday.id,
      restaurantId: holiday.restaurantId,
      startDate: holiday.startDate
    });
  }

  console.log("holidayNotifier done", { count: holidays.length });
}

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
