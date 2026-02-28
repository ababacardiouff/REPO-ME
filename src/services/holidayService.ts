import { PrismaClient, Prisma } from "@prisma/client";
import { publishEvent } from "./eventBus";

type RestaurantMeta = { country?: string | null; region?: string | null };

type RecurringParts = { byMonth?: number; byMonthDay?: number };

const prisma = new PrismaClient();

function parseRecurringRule(rule?: string | null): RecurringParts {
  if (!rule) return {};
  return rule.split(";").reduce<RecurringParts>((acc, part) => {
    const [key, value] = part.split("=");
    if (key === "BYMONTH") acc.byMonth = Number(value);
    if (key === "BYMONTHDAY") acc.byMonthDay = Number(value);
    return acc;
  }, {});
}

function isRecurringMatch(at: Date, recurringRule?: string | null) {
  if (!recurringRule) return false;
  const parts = parseRecurringRule(recurringRule);
  if (!parts.byMonth || !parts.byMonthDay) return false;
  return at.getUTCMonth() + 1 === parts.byMonth && at.getUTCDate() === parts.byMonthDay;
}

function normalizeDateString(atIso: string): string {
  return new Date(atIso).toISOString().slice(0, 10);
}

function toAdjustmentAppliesTo(value: Prisma.JsonValue): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : [];
}

function toHolidayAdjustment(value: Prisma.JsonValue) {
  return typeof value === "object" && value !== null ? value : null;
}

export async function findApplicableHolidays(restaurantId: string, atIso: string, restaurantMeta?: RestaurantMeta) {
  const dateStr = normalizeDateString(atIso);

  const candidates = await prisma.eatsHoliday.findMany({
    where: {
      OR: [
        {
          AND: [
            { startDate: { lte: new Date(dateStr) } },
            { endDate: { gte: new Date(dateStr) } }
          ]
        },
        { recurringRule: { not: null } }
      ]
    }
  });

  const at = new Date(atIso);

  const applicable = candidates.filter((h) => {
    if (h.restaurantId && h.restaurantId === restaurantId) return true;
    if (h.scopeType === "region" && restaurantMeta?.region && h.scopeValue === restaurantMeta.region) return true;
    if (h.scopeType === "country" && restaurantMeta?.country && h.scopeValue === restaurantMeta.country) return true;
    if (h.scopeType === "global") return true;
    if (h.recurringRule) return isRecurringMatch(at, h.recurringRule);
    return false;
  });

  applicable.sort((a, b) => (a.priority || 10) - (b.priority || 10));
  return applicable;
}

export async function computeEffectivePricing(restaurantId: string, atIso: string, restaurantMeta?: RestaurantMeta) {
  const holidays = await findApplicableHolidays(restaurantId, atIso, restaurantMeta);
  let isBlackout = false;
  const adjustments: Array<{ holidayId: string; appliesTo: string[]; pricingAdjustment: Prisma.JsonValue }> = [];

  for (const h of holidays) {
    if (h.isBlackout) {
      isBlackout = true;
      break;
    }

    if (h.pricingAdjustment) {
      adjustments.push({
        holidayId: h.id,
        appliesTo: toAdjustmentAppliesTo(h.appliesTo),
        pricingAdjustment: h.pricingAdjustment
      });
    }
  }

  return { isBlackout, adjustments, holidaysCount: holidays.length };
}

export async function createHoliday(payload: Prisma.EatsHolidayUncheckedCreateInput) {
  const created = await prisma.eatsHoliday.create({ data: payload });
  await publishEvent("eats.blackout.changed", { restaurantId: created.restaurantId, id: created.id, action: "created" });
  await publishEvent("eats.pricing.changed", { restaurantId: created.restaurantId, id: created.id, action: "created" });
  return created;
}

export async function updateHoliday(id: string, payload: Prisma.EatsHolidayUncheckedUpdateInput) {
  const updated = await prisma.eatsHoliday.update({ where: { id }, data: payload });
  await publishEvent("eats.blackout.changed", { restaurantId: updated.restaurantId, id: updated.id, action: "updated" });
  await publishEvent("eats.pricing.changed", { restaurantId: updated.restaurantId, id: updated.id, action: "updated" });
  return updated;
}

export async function deleteHoliday(id: string) {
  const deleted = await prisma.eatsHoliday.delete({ where: { id } });
  await publishEvent("eats.blackout.changed", { restaurantId: deleted.restaurantId, id: deleted.id, action: "deleted" });
  await publishEvent("eats.pricing.changed", { restaurantId: deleted.restaurantId, id: deleted.id, action: "deleted" });
  return deleted;
}

export function getPricingAdjustment(value: Prisma.JsonValue) {
  return toHolidayAdjustment(value);
}
