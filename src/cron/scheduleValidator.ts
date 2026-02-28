import { PrismaClient } from "@prisma/client";
import { publishEvent } from "../services/eventBus";

const prisma = new PrismaClient();

async function run() {
  const schedules = await prisma.eatsSchedule.findMany();
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  for (const schedule of schedules) {
    await publishEvent("eats.availability.snapshot", {
      restaurantId: schedule.restaurantId,
      from: now.toISOString(),
      to: tomorrow.toISOString(),
      ts: new Date().toISOString()
    });
  }

  await prisma.$disconnect();
  console.log("scheduleValidator: done");
}

run().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
