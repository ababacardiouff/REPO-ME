import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllActiveRestaurants() {
  return prisma.eatsRestaurant.findMany({
    select: { id: true, country: true, currency: true }
  });
}
