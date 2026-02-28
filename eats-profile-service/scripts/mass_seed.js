const crypto = require("node:crypto");
const { Pool } = require("pg");

const N = process.env.SEED_COUNT ? parseInt(process.env.SEED_COUNT, 10) : 1000;
const DATABASE_URL = process.env.DATABASE_URL || "postgres://molam:password@localhost:5432/molam_eats";

const pool = new Pool({ connectionString: DATABASE_URL });

const currencies = ["XOF", "USD", "EUR", "GHS"];
const locales = ["fr", "en", "wo"];
const providers = ["MolamPay", "Stripe", "Visa", "Mastercard"];
const statuses = ["PENDING", "PREPARING", "ON_THE_WAY", "DELIVERED", "CANCELLED"];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seed() {
  const client = await pool.connect();
  try {
    console.log(`🌍 Seeding ${N} Molam Eats profiles...`);
    await client.query("BEGIN");

    for (let i = 0; i < N; i += 1) {
      const userId = crypto.randomUUID();
      const firstName = `User${i + 1}`;
      const lastName = `Test${i + 1}`;
      const email = `user${i + 1}@example.com`;
      const phone = `+22177${String(1000000 + i).slice(-7)}`;
      const locale = locales[i % locales.length];
      const currency = currencies[i % currencies.length];

      const { rows: profileRows } = await client.query(
        `INSERT INTO eats_profiles (user_id, first_name, last_name, email, phone, locale, currency)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
        [userId, firstName, lastName, email, phone, locale, currency]
      );

      const profileId = profileRows[0].id;

      await client.query(
        `INSERT INTO eats_addresses (profile_id, label, street, city, country, is_default)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [profileId, "Home", `Street ${i + 1}`, "Dakar", "Senegal", true]
      );

      await client.query(
        `INSERT INTO eats_payment_methods (profile_id, provider, token, last4, is_default)
         VALUES ($1,$2,$3,$4,$5)`,
        [profileId, randomItem(providers), `tok_${Math.random().toString(36).slice(2, 12)}`, `${1000 + (i % 9000)}`, true]
      );

      const orderCount = Math.floor(Math.random() * 6);
      for (let j = 0; j < orderCount; j += 1) {
        await client.query(
          `INSERT INTO eats_orders (profile_id, status, total_amount, currency, created_at, updated_at)
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [profileId, randomItem(statuses), 500 + Math.floor(Math.random() * 19500), randomItem(currencies), new Date(), new Date()]
        );
      }
    }

    await client.query("COMMIT");
    console.log("✅ Seeding completed.");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Seeding failed", error);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
