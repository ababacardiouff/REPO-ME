import { db } from "../infra/db";

export async function canPublish(vendorId: string, additional = 1) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;

  const sub = await db.oneOrNone<{ plan_code: string }>(
    "SELECT plan_code FROM eats_vendor_subscriptions WHERE vendor_id=$1 AND status='ACTIVE' ORDER BY current_period_end DESC LIMIT 1",
    [vendorId]
  );
  if (!sub) return { allowed: false, reason: "no_active_subscription" };

  const plan = await db.oneOrNone<{ article_quota: number | null }>("SELECT article_quota FROM eats_plans WHERE code=$1", [sub.plan_code]);
  if (!plan) return { allowed: false, reason: "plan_not_found" };

  if (plan.article_quota === null) return { allowed: true, remaining: null as number | null };

  await db.none(
    `INSERT INTO eats_articles_usage (vendor_id, period_year, period_month, used_articles)
     VALUES($1,$2,$3,0) ON CONFLICT (vendor_id, period_year, period_month) DO NOTHING`,
    [vendorId, year, month]
  );

  const usage = await db.one<{ used_articles: number }>(
    "SELECT used_articles FROM eats_articles_usage WHERE vendor_id=$1 AND period_year=$2 AND period_month=$3",
    [vendorId, year, month]
  );
  const remaining = plan.article_quota - usage.used_articles;
  return { allowed: remaining >= additional, remaining };
}
