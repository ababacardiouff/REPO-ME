import { randomUUID } from "crypto";
import { Client } from "pg";

async function seed() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const samples = [
    { source: "product", text: "Promo officielle", status: "PENDING" },
    { source: "talk", text: "Contact me john[dot]doe[at]gmail[dot]com", status: "SANITIZED" },
    { source: "ads", text: "Creative ok", status: "ALLOWED" }
  ];

  for (const sample of samples) {
    await client.query(
      `INSERT INTO moderation_requests (id, source, source_id, content, status, fatima_response)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [
        randomUUID(),
        sample.source,
        randomUUID(),
        JSON.stringify({ text: sample.text }),
        sample.status,
        JSON.stringify({ seeded: true })
      ]
    );
  }

  await client.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
