import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { holidayCheckLatency, holidayChecksTotal } from "../metrics/holidaysMetrics";
import * as svc from "../services/holidayService";

const prisma = new PrismaClient();

export async function listForRestaurant(req: Request, res: Response) {
  const restId = req.params.restId;
  const holidays = await prisma.eatsHoliday.findMany({
    where: { OR: [{ restaurantId: restId }, { scopeType: "global" }, { scopeType: "country" }, { scopeType: "region" }] },
    orderBy: { startDate: "asc" }
  });
  return res.json(holidays);
}

export async function createHoliday(req: Request, res: Response) {
  const created = await svc.createHoliday(req.body);
  return res.status(201).json(created);
}

export async function updateHoliday(req: Request, res: Response) {
  const updated = await svc.updateHoliday(req.params.id, req.body);
  return res.json(updated);
}

export async function deleteHoliday(req: Request, res: Response) {
  await svc.deleteHoliday(req.params.id);
  return res.status(204).send();
}

export async function getEffectivePricing(req: Request, res: Response) {
  holidayChecksTotal.inc();
  const timer = holidayCheckLatency.startTimer();

  try {
    const restId = req.params.restId;
    const { at } = req.body as { at?: string };
    let rest: { country: string | null; slug: string | null } | null = null;
    try {
      rest = (await prisma.eatsRestaurant.findUnique({ where: { id: restId }, select: { country: true, slug: true } })) as { country: string | null; slug: string | null } | null;
    } catch {
      rest = null;
    }
    const meta = { country: rest?.country || null, region: rest?.slug || null };
    const effective = await svc.computeEffectivePricing(restId, at || new Date().toISOString(), meta);
    return res.json(effective);
  } finally {
    timer();
  }
}
