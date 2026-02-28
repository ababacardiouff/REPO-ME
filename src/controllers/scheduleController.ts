import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { availabilityCheckLatency, availabilityChecksTotal } from "../metrics/scheduleMetrics";
import * as svc from "../services/scheduleService";

const prisma = new PrismaClient();

export async function getSchedule(req: Request, res: Response) {
  const restId = req.params.restId;
  const schedule = await prisma.eatsSchedule.findUnique({
    where: { restaurantId: restId },
    include: { weeklyRules: { orderBy: { position: "asc" } }, exceptions: true }
  });
  return res.json(schedule || {});
}

export async function createOrUpdateSchedule(req: Request, res: Response) {
  const restId = req.params.restId;
  const body = req.body;

  const existing = await prisma.eatsSchedule.findUnique({ where: { restaurantId: restId } });

  let schedule;
  if (existing) {
    const { weeklyRules: _weeklyRules, exceptions: _exceptions, ...scheduleData } = body;
    schedule = await prisma.eatsSchedule.update({ where: { id: existing.id }, data: scheduleData });
  } else {
    const { weeklyRules: _weeklyRules, exceptions: _exceptions, ...scheduleData } = body;
    schedule = await prisma.eatsSchedule.create({ data: { restaurantId: restId, ...scheduleData } });
  }

  await svc.publishScheduleChanged(restId);
  return res.json(schedule);
}

export async function createWeeklyRule(req: Request, res: Response) {
  const scheduleId = req.params.scheduleId;
  const rule = await prisma.eatsScheduleWeeklyRule.create({ data: { scheduleId, ...req.body } });
  const schedule = await prisma.eatsSchedule.findUnique({ where: { id: scheduleId } });
  if (schedule) await svc.publishScheduleChanged(schedule.restaurantId);
  return res.status(201).json(rule);
}

export async function updateWeeklyRule(req: Request, res: Response) {
  const id = req.params.id;
  const rule = await prisma.eatsScheduleWeeklyRule.update({ where: { id }, data: req.body });
  const schedule = await prisma.eatsSchedule.findUnique({ where: { id: rule.scheduleId } });
  if (schedule) await svc.publishScheduleChanged(schedule.restaurantId);
  return res.json(rule);
}

export async function deleteWeeklyRule(req: Request, res: Response) {
  const id = req.params.id;
  const rule = await prisma.eatsScheduleWeeklyRule.delete({ where: { id } });
  const schedule = await prisma.eatsSchedule.findUnique({ where: { id: rule.scheduleId } });
  if (schedule) await svc.publishScheduleChanged(schedule.restaurantId);
  return res.status(204).send();
}

export async function createException(req: Request, res: Response) {
  const scheduleId = req.params.scheduleId;
  const ex = await prisma.eatsScheduleException.create({ data: { scheduleId, ...req.body } });
  const schedule = await prisma.eatsSchedule.findUnique({ where: { id: scheduleId } });
  if (schedule) await svc.publishScheduleChanged(schedule.restaurantId);
  return res.status(201).json(ex);
}

export async function deleteException(req: Request, res: Response) {
  const id = req.params.id;
  const ex = await prisma.eatsScheduleException.delete({ where: { id } });
  const schedule = await prisma.eatsSchedule.findUnique({ where: { id: ex.scheduleId } });
  if (schedule) await svc.publishScheduleChanged(schedule.restaurantId);
  return res.status(204).send();
}

export async function checkAvailability(req: Request, res: Response) {
  availabilityChecksTotal.inc();
  const end = availabilityCheckLatency.startTimer();

  try {
    const restaurantId = req.params.restId;
    const { desiredAt, durationMinutes } = req.body;
    const result = await svc.checkAvailability(restaurantId, desiredAt, durationMinutes || 30);
    return res.json(result);
  } finally {
    end();
  }
}
