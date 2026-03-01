import { PrismaClient } from "@prisma/client";
import { surgeEvaluationsTotal, surgeEvaluationLatency } from "../metrics/surgeMetrics";
import { publishEvent } from "./eventBus";
import { callFatimaForSurgeDecision } from "./FatimaClient";
import { addDailyIncrease, getDailyIncrease } from "./surgeStateStore";

const prisma = new PrismaClient();

type EvalContext = {
  at?: string;
  demandRatio?: number;
  queueLength?: number;
  avgETA?: number;
  weather?: { condition?: string };
  orderValue?: number;
  currency?: string;
};

export async function listRules(restaurantId: string) {
  const restaurant = await prisma.eatsRestaurant.findUnique({ where: { id: restaurantId } });
  return prisma.eatsSurgeRule.findMany({
    where: {
      OR: [
        { restaurantId },
        { scopeType: "region", scopeValue: restaurant?.language || null },
        { scopeType: "country", scopeValue: restaurant?.country || null },
        { scopeType: "global" }
      ]
    },
    orderBy: { priority: "asc" }
  });
}

export async function createRule(payload: any, user: any) {
  const created = await prisma.eatsSurgeRule.create({ data: payload });
  await publishEvent("eats.surge.rule.created", { id: created.id, restaurantId: created.restaurantId, actor: user?.sub || null });
  return created;
}

export async function updateRule(id: string, payload: any, user: any) {
  const updated = await prisma.eatsSurgeRule.update({ where: { id }, data: payload });
  await publishEvent("eats.surge.rule.updated", { id: updated.id, restaurantId: updated.restaurantId, actor: user?.sub || null });
  return updated;
}

export async function deleteRule(id: string, user: any) {
  const deleted = await prisma.eatsSurgeRule.delete({ where: { id } });
  await publishEvent("eats.surge.rule.deleted", { id: deleted.id, restaurantId: deleted.restaurantId, actor: user?.sub || null });
}

export async function evaluate(restaurantId: string, context: EvalContext) {
  const timer = surgeEvaluationLatency.startTimer();
  surgeEvaluationsTotal.inc();

  const restaurant = await prisma.eatsRestaurant.findUnique({ where: { id: restaurantId } });
  const schedule = await prisma.eatsSchedule.findUnique({ where: { restaurantId } });

  const candidates = await prisma.eatsSurgeRule.findMany({
    where: {
      enabled: true,
      OR: [
        { restaurantId },
        { scopeType: "region", scopeValue: restaurant?.language || null },
        { scopeType: "country", scopeValue: restaurant?.country || null },
        { scopeType: "global" }
      ]
    },
    orderBy: { priority: "asc" }
  });

  const atIso = context.at || new Date().toISOString();
  const applicable = candidates.filter((r) => isWindowMatch(r.timeWindows, atIso, schedule?.timezone || "UTC"))
    .filter((r) => evaluateConditions(r.conditions, context));

  let finalAdjustments: Array<{ ruleId?: string; action?: any; currency?: string; [key: string]: unknown }> = applicable.map((r) => ({
    ruleId: r.id,
    action: r.action as any,
    currency: context.currency || restaurant?.currency || "XOF"
  }));

  const fatimaVerdict = await callFatimaForSurgeDecision({
    restaurantId,
    context,
    applicableRuleIds: applicable.map((r) => r.id)
  });

  if (fatimaVerdict?.veto) {
    finalAdjustments = [];
    await publishEvent("eats.surge.alerts", { restaurantId, reason: "FATIMA_VETO", details: fatimaVerdict });
  } else if (Array.isArray(fatimaVerdict?.adjustments)) {
    finalAdjustments = fatimaVerdict.adjustments as Array<{ ruleId?: string; action?: any; currency?: string }>;
  }

  const cap = Math.max(0, ...applicable.map((r) => r.maxDailyIncreasePercent || 0));
  const pendingIncrease = finalAdjustments.reduce((total, adj) => {
    if (adj.action?.type === "percent" && typeof adj.action.value === "number") {
      return total + adj.action.value;
    }
    return total;
  }, 0);

  const currentDayIncrease = await getDailyIncrease(restaurantId);
  if (cap > 0 && currentDayIncrease + pendingIncrease > cap) {
    finalAdjustments = [];
    await publishEvent("eats.surge.alerts", {
      restaurantId,
      reason: "DAILY_CAP_EXCEEDED",
      currentDayIncrease,
      pendingIncrease,
      cap
    });
  } else {
    for (const adj of finalAdjustments) {
      if (adj.action?.type === "percent" && typeof adj.action.value === "number") {
        await addDailyIncrease(restaurantId, adj.action.value);
      }
    }
  }

  await publishEvent("eats.surge.evaluated", { restaurantId, at: atIso, adjustments: finalAdjustments });
  timer();
  return { adjustments: finalAdjustments, Fatima: fatimaVerdict };
}

function isWindowMatch(timeWindows: unknown, atIso: string, timezone: string) {
  const d = new Date(atIso);
  const weekdayName = new Intl.DateTimeFormat("en-US", { timeZone: timezone, weekday: "short" }).format(d);
  const weekdayByName: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const weekday = weekdayByName[weekdayName] ?? d.getUTCDay();
  const hhmm = new Intl.DateTimeFormat("en-GB", { timeZone: timezone, hour: "2-digit", minute: "2-digit", hour12: false }).format(d);
  const windows = Array.isArray(timeWindows) ? timeWindows : [];
  if (!windows.length) return true;

  return windows.some((w: any) => {
    if (w?.weekday !== undefined && w.weekday !== weekday) return false;
    if (w?.start && w?.end) return hhmm >= w.start && hhmm <= w.end;
    return true;
  });
}

function evaluateConditions(conditions: any, context: EvalContext): boolean {
  if (!conditions) return false;
  if (conditions.demand_ratio) {
    const v = context.demandRatio ?? 0;
    if (conditions.demand_ratio.gt !== undefined && !(v > conditions.demand_ratio.gt)) return false;
    if (conditions.demand_ratio.gte !== undefined && !(v >= conditions.demand_ratio.gte)) return false;
    if (conditions.demand_ratio.lt !== undefined && !(v < conditions.demand_ratio.lt)) return false;
  }
  if (conditions.queue) {
    const q = context.queueLength ?? 0;
    if (conditions.queue.gt !== undefined && !(q > conditions.queue.gt)) return false;
    if (conditions.queue.gte !== undefined && !(q >= conditions.queue.gte)) return false;
  }
  if (conditions.avg_eta) {
    const eta = context.avgETA ?? 0;
    if (conditions.avg_eta.gt !== undefined && !(eta > conditions.avg_eta.gt)) return false;
  }
  if (conditions.weather?.in && Array.isArray(conditions.weather.in)) {
    if (!conditions.weather.in.includes(context.weather?.condition)) return false;
  }
  return true;
}
