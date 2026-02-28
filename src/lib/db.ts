import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export const db = {
  query: (text: string, params: any[] = []) => pool.query(text, params),
  async one<T = any>(text: string, params: any[] = []): Promise<T> {
    const result = await pool.query(text, params);
    if (result.rowCount !== 1) {
      throw new Error(`Expected one row, got ${result.rowCount}`);
    }
    return result.rows[0] as T;
  },
  async oneOrNone<T = any>(text: string, params: any[] = []): Promise<T | null> {
    const result = await pool.query(text, params);
    if (result.rowCount === 0) {
      return null;
    }
    if (result.rowCount !== 1) {
      throw new Error(`Expected zero or one row, got ${result.rowCount}`);
    }
    return result.rows[0] as T;
  },
  async manyOrNone<T = any>(text: string, params: any[] = []): Promise<T[]> {
    const result = await pool.query(text, params);
    return result.rows as T[];
  },
  async none(text: string, params: any[] = []): Promise<void> {
    await pool.query(text, params);
  }
};
