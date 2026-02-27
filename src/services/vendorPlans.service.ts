import { db } from "../infra/db";

export async function listPlans() {
  return db.manyOrNone("SELECT code, name, price_cents, currency, article_quota FROM eats_plans ORDER BY price_cents ASC");
}

export async function getActiveSubscription(vendorId: string) {
  return db.oneOrNone(
    "SELECT * FROM eats_vendor_subscriptions WHERE vendor_id=$1 AND status='ACTIVE' ORDER BY current_period_end DESC LIMIT 1",
    [vendorId]
  );
}

export async function subscribeVendor(vendorId: string, planCode: string, paymentProvider?: string, paymentSubscriptionId?: string) {
  const now = new Date();
  const end = new Date(now);
  end.setMonth(end.getMonth() + 1);

  const sub = await db.one(
    `INSERT INTO eats_vendor_subscriptions (vendor_id, plan_code, status, current_period_start, current_period_end, payment_provider, payment_subscription_id)
     VALUES($1,$2,'ACTIVE',$3,$4,$5,$6) RETURNING *`,
    [vendorId, planCode, now.toISOString(), end.toISOString(), paymentProvider || null, paymentSubscriptionId || null]
  );

  const y = now.getUTCFullYear();
  const m = now.getUTCMonth() + 1;
  await db.none(
    `INSERT INTO eats_articles_usage (vendor_id, period_year, period_month, used_articles)
     VALUES($1,$2,$3,0) ON CONFLICT (vendor_id, period_year, period_month) DO NOTHING`,
    [vendorId, y, m]
  );

  return sub;
}

export async function incrementUsageIfAllowed(vendorId: string) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;

  const sub = await getActiveSubscription(vendorId);
  if (!sub) {
    throw new Error("no-active-subscription");
  }

  const plan = await db.one<{ article_quota: number | null }>("SELECT article_quota FROM eats_plans WHERE code=$1", [sub.plan_code]);

  await db.none(
    `INSERT INTO eats_articles_usage (vendor_id, period_year, period_month, used_articles)
     VALUES($1,$2,$3,0) ON CONFLICT (vendor_id, period_year, period_month) DO NOTHING`,
    [vendorId, year, month]
  );

  if (plan.article_quota === null) {
    await db.none(
      "UPDATE eats_articles_usage SET updated_at=now() WHERE vendor_id=$1 AND period_year=$2 AND period_month=$3",
      [vendorId, year, month]
    );
    return { allowed: true, remaining: null as number | null };
  }

  const usage = await db.one<{ used_articles: number }>(
    "SELECT used_articles FROM eats_articles_usage WHERE vendor_id=$1 AND period_year=$2 AND period_month=$3",
    [vendorId, year, month]
  );

  if (usage.used_articles >= plan.article_quota) {
    return { allowed: false, remaining: 0 };
  }

  await db.none(
    "UPDATE eats_articles_usage SET used_articles = used_articles + 1, updated_at=now() WHERE vendor_id=$1 AND period_year=$2 AND period_month=$3",
    [vendorId, year, month]
  );
  const used = usage.used_articles + 1;
  return { allowed: true, remaining: plan.article_quota - used };
}
