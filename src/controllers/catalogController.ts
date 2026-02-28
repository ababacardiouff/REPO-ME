import { Request, Response } from "express";
import * as svc from "../services/catalogService";
import { itemCreates, itemDeletes, itemUpdates } from "../metrics";

function handleError(res: Response, err: unknown) {
  if (err instanceof Error && err.message === "content_blocked") {
    return res.status(422).json({ error: "content_blocked" });
  }
  return res.status(500).json({ error: "internal_error" });
}

export async function createRestaurant(req: Request, res: Response) {
  const restaurant = await svc.createRestaurant(req.molam!.sub, req.body);
  return res.status(201).json(restaurant);
}

export async function getRestaurant(req: Request, res: Response) {
  const data = await svc.getRestaurant(req.params.id);
  if (!data) return res.status(404).json({ error: "not_found" });
  return res.json(data);
}

export async function updateRestaurant(req: Request, res: Response) {
  const data = await svc.updateRestaurant(req.params.id, req.body, req.molam!.sub);
  return res.json(data);
}

export async function deleteRestaurant(req: Request, res: Response) {
  await svc.deleteRestaurant(req.params.id, req.molam!.sub);
  return res.status(204).send();
}

export async function createCategory(req: Request, res: Response) {
  const data = await svc.createCategory(req.params.restId, req.body, req.molam!.sub);
  return res.status(201).json(data);
}

export async function updateCategory(req: Request, res: Response) {
  const data = await svc.updateCategory(req.params.id, req.body, req.molam!.sub);
  return res.json(data);
}

export async function deleteCategory(req: Request, res: Response) {
  await svc.deleteCategory(req.params.id, req.molam!.sub);
  return res.status(204).send();
}

export async function createItem(req: Request, res: Response) {
  try {
    const data = await svc.createItem(req.params.restId, req.body, req.molam!.sub);
    itemCreates.inc();
    return res.status(201).json(data);
  } catch (err) {
    return handleError(res, err);
  }
}

export async function getItem(req: Request, res: Response) {
  const data = await svc.getItem(req.params.id);
  if (!data) return res.status(404).json({ error: "not_found" });
  return res.json(data);
}

export async function updateItem(req: Request, res: Response) {
  const data = await svc.updateItem(req.params.id, req.body, req.molam!.sub);
  itemUpdates.inc();
  return res.json(data);
}

export async function deleteItem(req: Request, res: Response) {
  await svc.deleteItem(req.params.id, req.molam!.sub);
  itemDeletes.inc();
  return res.status(204).send();
}

export async function createVariant(req: Request, res: Response) {
  const data = await svc.createVariant(req.params.itemId, req.body, req.molam!.sub);
  return res.status(201).json(data);
}

export async function updateVariant(req: Request, res: Response) {
  const data = await svc.updateVariant(req.params.id, req.body, req.molam!.sub);
  return res.json(data);
}

export async function deleteVariant(req: Request, res: Response) {
  await svc.deleteVariant(req.params.id, req.molam!.sub);
  return res.status(204).send();
}

export async function getRestaurantMenu(req: Request, res: Response) {
  const data = await svc.getRestaurantMenu(req.params.restId);
  return res.json(data);
}

export async function searchItems(req: Request, res: Response) {
  const data = await svc.searchItems(req.query.q as string | undefined, req.query.restaurantId as string | undefined);
  return res.json(data);
}
