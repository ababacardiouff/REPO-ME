import { db } from "../src/lib/db";

export async function seedCommissions() {
  await db.none(
    `INSERT INTO commissions(order_id, vendor_id, commission_amount, vendor_earning)
     VALUES
      ('order100', 'vendorA', 12, 38),
      ('order101', 'vendorB', 12, 88),
      ('order102', 'vendorC', 12, 188)
     ON CONFLICT (order_id) DO NOTHING`
  );

  console.log("✅ Seeded commissions");
}

if (require.main === module) {
  seedCommissions().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
