import { faker } from "@faker-js/faker";
import { prisma } from "../src/lib/prisma";

async function main() {
  const userId = faker.string.uuid();

  const cart = await prisma.eats_carts.create({
    data: { user_id: userId },
  });

  for (let i = 0; i < 5; i++) {
    await prisma.eats_cart_items.create({
      data: {
        cart_id: cart.id,
        product_id: faker.string.uuid(),
        quantity: faker.number.int({ min: 1, max: 5 }),
        scheduled_date: faker.date.soon({ days: 10 }),
        note: faker.lorem.sentence(),
      },
    });
  }

  // eslint-disable-next-line no-console
  console.log("🌱 Admin seed complete");
}

main().finally(async () => {
  await prisma.$disconnect();
});
