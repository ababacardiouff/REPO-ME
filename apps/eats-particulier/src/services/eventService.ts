import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function enqueueEvent(event: { type: string; payload: unknown }) {
  await prisma.event.create({
    data: {
      type: event.type,
      payload: JSON.stringify(event.payload),
    },
  });
}
