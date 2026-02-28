import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function run() {
  const pending = await prisma.event.findMany({
    where: { type: "EATS_ACCOUNT_ACTIVATED" },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  for (const event of pending) {
    // Placeholder for analytics/FATIMA async processing.
    // In production, this would be Kafka/SQS driven.
    console.log("processing_event", event.id);
  }
}

void run();
