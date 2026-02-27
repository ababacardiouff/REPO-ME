import { randomUUID } from "crypto";
import { Client } from "pg";

async function seedImages() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  await client.query(
    `INSERT INTO moderation_requests (id, source, source_id, content, status, fatima_response)
     VALUES ($1,$2,$3,$4,$5,$6)`,
    [
      randomUUID(),
      "product",
      randomUUID(),
      JSON.stringify({ images: [{ url: "https://example.com/seeded_image_test.jpg" }] }),
      "PENDING",
      JSON.stringify({ seeded: true, kind: "image" })
    ]
  );

  await client.end();
}

seedImages().catch((err) => {
  console.error(err);
  process.exit(1);
});
