import { PrismaClient } from "@prisma/client";
import { publishEvent } from "./eventBus";

const prisma = new PrismaClient();

function toDate(value: string): Date {
  return new Date(value);
}

function getZonedDateParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).formatToParts(date);

  const get = (type: string) => parts.find((p) => p.type === type)?.value || "";
  const weekdayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
    second: get("second"),
    weekday: weekdayMap[get("weekday")] ?? date.getUTCDay()
  };
}

function secondsFromTimeString(value: string): number {
  const [h, m, s] = value.split(":").map(Number);
  return h * 3600 + m * 60 + (s || 0);
}

export async function checkAvailability(restaurantId: string, desiredAtIso: string, durationMinutes = 30) {
  const schedule = await prisma.eatsSchedule.findUnique({
    where: { restaurantId },
    include: { weeklyRules: true, exceptions: true }
  });

  if (!schedule) return { available: false, reason: "no_schedule" };

  const tz = schedule.timezone || "UTC";
  const desired = toDate(desiredAtIso);
  const now = new Date();

  if (!schedule.preOrderEnabled && desired.getTime() - now.getTime() > 5 * 60_000) {
    return { available: false, reason: "preorder_disabled" };
  }

  const leadMs = (schedule.leadTimeMinutes || 0) * 60_000;
  if (desired.getTime() < now.getTime() + leadMs) {
    return { available: false, reason: "lead_time_not_met" };
  }

  const parts = getZonedDateParts(desired, tz);
  const localDate = `${parts.year}-${parts.month}-${parts.day}`;
  const localSeconds = Number(parts.hour) * 3600 + Number(parts.minute) * 60 + Number(parts.second);

  const exception = schedule.exceptions.find((e) => e.date.toISOString().slice(0, 10) === localDate);

  if (exception) {
    if (!exception.isOpen) return { available: false, reason: "closed_exception" };
    if (exception.startTime && exception.endTime) {
      const start = secondsFromTimeString(exception.startTime);
      const end = secondsFromTimeString(exception.endTime);
      if (!(localSeconds >= start && localSeconds < end)) {
        return { available: false, reason: "outside_exception_hours" };
      }
    }
  } else {
    const rules = schedule.weeklyRules
      .filter((r) => r.weekday === parts.weekday && r.isOpen)
      .sort((a, b) => a.position - b.position);

    if (rules.length === 0) return { available: false, reason: "closed_weekday" };

    const matches = rules.some((r) => {
      const start = secondsFromTimeString(r.startTime);
      const end = secondsFromTimeString(r.endTime);
      return localSeconds >= start && localSeconds < end;
    });

    if (!matches) return { available: false, reason: "outside_open_hours" };
  }

  const windowStart = new Date(Math.floor(desired.getTime() / 60_000) * 60_000);
  const windowEnd = new Date(windowStart.getTime() + durationMinutes * 60_000);

  const load = await prisma.eatsOrderLoad.findFirst({
    where: {
      restaurantId,
      windowStart: { lte: windowStart },
      windowEnd: { gte: windowEnd }
    }
  });

  const currentCount = load?.count || 0;
  const remaining = schedule.maxSimultaneousOrders - currentCount;
  if (remaining <= 0) return { available: false, reason: "capacity_full" };

  return { available: true, capacityRemaining: remaining };
}

export async function incrementLoad(restaurantId: string, windowStartIso: string, windowEndIso: string) {
  const ws = new Date(windowStartIso);
  const we = new Date(windowEndIso);

  return prisma.eatsOrderLoad.upsert({
    where: {
      restaurantId_windowStart_windowEnd: {
        restaurantId,
        windowStart: ws,
        windowEnd: we
      }
    },
    create: { restaurantId, windowStart: ws, windowEnd: we, count: 1 },
    update: { count: { increment: 1 } }
  });
}

export async function publishScheduleChanged(restaurantId: string) {
  await publishEvent("eats.availability.changed", { restaurantId, ts: new Date().toISOString() });
}
