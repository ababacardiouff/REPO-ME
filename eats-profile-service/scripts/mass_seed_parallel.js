const crypto = require("node:crypto");
const { Pool } = require("pg");

const N = process.env.SEED_COUNT ? parseInt(process.env.SEED_COUNT, 10) : 10000;
const BATCH_SIZE = 50;
const DATABASE_URL = process.env.DATABASE_URL || "postgres://molam:password@localhost:5432/molam_eats";

const pool = new Pool({ connectionString: DATABASE_URL });
const currencies = ["XOF", "USD", "EUR", "GHS"];
const locales = ["fr", "en", "wo"];
const providers = ["MolamPay", "Stripe", "Visa", "Mastercard"];
const statuses = ["PENDING", "PREPARING", "ON_THE_WAY", "DELIVERED", "CANCELLED"];
const RESET_DB = process.env.RESET_DB === "true";

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function genProfile(i) {
  return {
    userId: crypto.randomUUID(),
    firstName: `User${i + 1}`,
    lastName: `Test${i + 1}`,
    email: `user${i + 1}@example.com`,
    phone: `+22177${String(1000000 + i).slice(-7)}`,
    locale: locales[i % locales.length],
    currency: currencies[i % currencies.length]
  };
}

async function seedBatch(client, batch) {
  await Promise.all(batch.map(async (profile) => {
    const { rows } = await client.query(
      `INSERT INTO eats_profiles (user_id, first_name, last_name, email, phone, locale, currency)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
      [profile.userId, profile.firstName, profile.lastName, profile.email, profile.phone, profile.locale, profile.currency]
    );

    const profileId = rows[0].id;

    await client.query(
      `INSERT INTO eats_addresses (profile_id, label, street, city, country, is_default)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [profileId, "Home", `Street ${Math.floor(Math.random() * 1000)}`, "Dakar", "Senegal", true]
    );

    await client.query(
      `INSERT INTO eats_payment_methods (profile_id, provider, token, last4, is_default)
       VALUES ($1,$2,$3,$4,$5)`,
      [profileId, randomItem(providers), `tok_${Math.random().toString(36).slice(2, 12)}`, `${1000 + Math.floor(Math.random() * 9000)}`, true]
    );

    const orderCount = Math.floor(Math.random() * 6);
    for (let i = 0; i < orderCount; i += 1) {
      await client.query(
        `INSERT INTO eats_orders (profile_id, status, total_amount, currency, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [profileId, randomItem(statuses), 500 + Math.floor(Math.random() * 19500), randomItem(currencies), new Date(), new Date()]
      );
    }
  }));
}

async function seed() {
  const client = await pool.connect();
  try {
    console.log(`🚀 Seeding ${N} Molam Eats profiles in batches of ${BATCH_SIZE}...`);
    await client.query("BEGIN");

    if (RESET_DB) {
      await client.query("TRUNCATE TABLE eats_orders, eats_payment_methods, eats_addresses, eats_profiles RESTART IDENTITY CASCADE");
      console.log("🔄 Existing Eats profile data reset before seeding.");
    }

    let batch = [];
    for (let i = 0; i < N; i += 1) {
      batch.push(genProfile(i));
      if (batch.length === BATCH_SIZE || i === N - 1) {
        await seedBatch(client, batch);
        console.log(`✅ Inserted ${i + 1}/${N} profiles`);
        batch = [];
      }
    }

    await client.query("COMMIT");
    console.log("🎉 Seeding completed successfully.");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Seeding failed", error);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
