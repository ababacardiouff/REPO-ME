import { Request, Response } from "express";
import {
  findOrCreateEatsUser,
  getEatsUserProfile,
  updateEatsUser,
  listUserAddresses,
  createAddress,
} from "../services/userService";
import { enqueueEvent } from "../services/eventService";
import { activationsCounter } from "../metrics";

export async function activateAccount(req: Request, res: Response) {
  const molam = (req as any).molam;
  const user = await findOrCreateEatsUser(molam);

  activationsCounter.inc();

  await enqueueEvent({
    type: "EATS_ACCOUNT_ACTIVATED",
    payload: { userId: user.id, molamId: molam.sub },
  });

  res.json({ status: "ok", user });
}

export async function getMyAccount(req: Request, res: Response) {
  const molam = (req as any).molam;
  const user = await getEatsUserProfile(molam.sub);
  if (!user) return res.status(404).json({ error: "not_found" });
  return res.json(user);
}

export async function updateAccount(req: Request, res: Response) {
  const molam = (req as any).molam;
  const user = await updateEatsUser(molam.sub, req.body);
  res.json(user);
}

export async function listAddresses(req: Request, res: Response) {
  const molam = (req as any).molam;
  const addresses = await listUserAddresses(molam.sub);
  res.json(addresses);
}

export async function addAddress(req: Request, res: Response) {
  const molam = (req as any).molam;
  const created = await createAddress(molam.sub, req.body);
  res.json(created);
}
