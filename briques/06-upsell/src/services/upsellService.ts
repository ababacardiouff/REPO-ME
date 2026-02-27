import { query } from "../infra/db";
import { FatimaClient } from "../lib/FatimaClient";
import { emitUpsellEvent } from "../infra/kafkaProducer";

export class UpsellService {
  private readonly fatima: FatimaClient;

  constructor() {
    this.fatima = new FatimaClient();
  }

  async getUpsellForProduct(productId: string, userId?: string | null, _locale = "fr", _currency = "XOF") {
    const premiumRes = await query(
      `SELECT p.id, p.title, p.price, p.currency FROM upsell_links ul
       JOIN products p ON p.id = ul.premium_product_id
       WHERE ul.product_id = $1`,
      [productId]
    );

    const crossRes = await query(
      `SELECT p.id, p.title, p.price, p.currency, cs.score FROM cross_sell_links cs
       JOIN products p ON p.id = cs.complementary_product_id
       WHERE cs.product_id = $1
       ORDER BY cs.score DESC LIMIT 12`,
      [productId]
    );

    const cacheRes = await query<{ payload: unknown; ttl: string }>(
      `SELECT payload, ttl FROM Fatima_suggestions_cache
       WHERE product_id=$1 AND (user_id IS NULL OR user_id=$2)`,
      [productId, userId ?? null]
    );

    let fatimaBundle: any = null;
    const now = new Date();
    if (cacheRes.rows.length > 0 && new Date(cacheRes.rows[0].ttl) > now) {
      fatimaBundle = cacheRes.rows[0].payload;
    }

    if (!fatimaBundle) {
      fatimaBundle = await this.fatima.getMenuBundle(productId, userId ?? null);
      await query(
        `INSERT INTO Fatima_suggestions_cache (product_id,user_id,payload,ttl) VALUES($1,$2,$3,$4)
         ON CONFLICT (product_id,user_id) DO UPDATE SET payload=EXCLUDED.payload, ttl=EXCLUDED.ttl`,
        [productId, userId ?? null, fatimaBundle, new Date(Date.now() + 5 * 60 * 1000)]
      );
    }

    void emitUpsellEvent({ type: "UPSERVE", productId, userId: userId ?? null, servedAt: new Date().toISOString() });

    return {
      premium: premiumRes.rows || [],
      cross: crossRes.rows || [],
      FatimaBundle: fatimaBundle,
    };
  }

  async audit(action: string, productId: string, userId: string | null, data: unknown, source = "FATIMA") {
    await query(
      `INSERT INTO upsell_audit_log (product_id,user_id,action,source,data) VALUES($1,$2,$3,$4,$5)`,
      [productId, userId, action, source, data]
    );
  }
}
