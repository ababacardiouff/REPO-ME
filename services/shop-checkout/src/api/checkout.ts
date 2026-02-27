import { Router } from "express";
import { getSavedAddresses, saveAddress, createOrder } from "../services/checkoutService";
import { molamIdAuth } from "../middleware/molamIdAuth";

const router = Router();

type ReqWithUser = { user: { sub: string } };

router.get("/addresses", molamIdAuth(), async (req, res) => {
  const userId = (req as unknown as ReqWithUser).user.sub;
  const addrs = await getSavedAddresses(userId);
  res.json(addrs);
});

router.post("/addresses", molamIdAuth(), async (req, res) => {
  const userId = (req as unknown as ReqWithUser).user.sub;
  try {
    const addr = await saveAddress(userId, req.body);
    res.json(addr);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/order", molamIdAuth(), async (req, res) => {
  const userId = (req as unknown as ReqWithUser).user.sub;
  try {
    const order = await createOrder({ userId, ...req.body });
    res.json(order);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
