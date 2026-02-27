import { db as pgpDb } from "./infra/db";

type QueryResult = {
  rows: any[];
};

async function query(text: string, params: any[] = []): Promise<QueryResult> {
  const rows = await pgpDb.any(text, params);
  return { rows };
}

export default {
  query
};
