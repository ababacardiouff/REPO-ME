import { db as pgpDb } from "./infra/db";

export type QueryResult = {
  rows: any[];
  rowCount: number;
};

export async function query(text: string, params: any[] = []): Promise<QueryResult> {
  const rows = await pgpDb.any(text, params);
  return { rows, rowCount: rows.length };
}

export default { query };
