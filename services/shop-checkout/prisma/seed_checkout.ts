import { prisma } from "../src/lib/prisma";

async function main() {
  const existingUsers = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT id FROM molam_id_users WHERE email = 'eats_user@test.com' LIMIT 1
  `;

  let userId = existingUsers[0]?.id;
  if (!userId) {
    const inserted = await prisma.$queryRaw<Array<{ id: string }>>`
      INSERT INTO molam_id_users (id, email, name, created_at)
      VALUES (gen_random_uuid(), 'eats_user@test.com', 'Eats User', now())
      RETURNING id
    `;
    userId = inserted[0].id;
  }

  await prisma.shop_addresses.create({
    data: {
      user_id: userId,
      label: "Home",
      first_name: "Test",
      last_name: "User",
      phone: "+221770000000",
      line1: "100 Example Street",
      city: "Dakar",
      country: "Senegal",
      is_default: true,
    },
  });

  console.log("Seed checkout complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
