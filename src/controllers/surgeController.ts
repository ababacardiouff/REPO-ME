import { Request, Response } from "express";
import * as svc from "../services/surgeService";

export async function listForRestaurant(req: Request, res: Response) {
  const rules = await svc.listRules(req.params.restId);
  res.json(rules);
}

export async function createRule(req: Request, res: Response) {
  const created = await svc.createRule(req.body, req.molam);
  res.status(201).json(created);
}

export async function updateRule(req: Request, res: Response) {
  const updated = await svc.updateRule(req.params.id, req.body, req.molam);
  res.json(updated);
}

export async function deleteRule(req: Request, res: Response) {
  await svc.deleteRule(req.params.id, req.molam);
  res.status(204).send();
}

export async function evaluateForRestaurant(req: Request, res: Response) {
  const evalRes = await svc.evaluate(req.params.restId, req.body || {});
  res.json(evalRes);
}
