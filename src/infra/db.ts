import pgPromise from "pg-promise";

const pgp = pgPromise({});
const db = pgp(process.env.DATABASE_URL || "postgres://molam:password@localhost:5432/molam");

export { db };
