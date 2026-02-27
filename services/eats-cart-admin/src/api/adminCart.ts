import { Router } from "express";
import { prisma } from "../lib/prisma";
import { molamIdAuth } from "../middleware/molamIdAuth";
import { emitAdminAudit } from "../infra/kafkaProducer";
import { cartItemsAdded } from "../metrics";
import { getCartDetail, listCarts } from "../services/adminCartService";

const router = Router();

router.get("/", molamIdAuth(["agent_internal:shop", "agent_admin:shop"]), async (req, res) => {
  const carts = await listCarts(req.query as any);
  res.json({ items: carts });
});

router.get("/:cartId", molamIdAuth(["agent_internal:shop"]), async (req, res) => {
  const cart = await getCartDetail(req.params.cartId);
  res.json(cart);
});

router.patch("/:cartId/items/:itemId", molamIdAuth(["agent_internal:shop"]), async (req, res) => {
  const { quantity, scheduledDate, note } = req.body;

  const updated = await prisma.eats_cart_items.update({
    where: { id: req.params.itemId },
    data: {
      quantity: quantity ?? undefined,
      scheduled_date: scheduledDate ? new Date(scheduledDate) : undefined,
      note: note ?? undefined,
    },
  });

  await emitAdminAudit({
    agentId: req.user?.sub,
    action: "EDIT_ITEM",
    targetCart: req.params.cartId,
    payload: { itemId: req.params.itemId, quantity, scheduledDate, note },
  });

  cartItemsAdded.inc();
  res.json(updated);
});

router.delete("/:cartId/items/:itemId", molamIdAuth(["agent_internal:shop"]), async (req, res) => {
  await prisma.eats_cart_items.delete({ where: { id: req.params.itemId } });

  await emitAdminAudit({
    agentId: req.user?.sub,
    action: "DELETE_ITEM",
    targetCart: req.params.cartId,
    payload: { itemId: req.params.itemId },
  });

  cartItemsAdded.inc();
  res.json({ deleted: true });
});

router.post("/:cartId/schedules/:scheduleId/confirm", molamIdAuth(["agent_admin:shop"]), async (req, res) => {
  const schedule = await prisma.eats_cart_schedules.update({
    where: { id: req.params.scheduleId },
    data: { status: "CONFIRMED" },
  });

  await emitAdminAudit({
    agentId: req.user?.sub,
    action: "FORCE_CONFIRM_SCHEDULE",
    targetCart: req.params.cartId,
    payload: { scheduleId: req.params.scheduleId },
  });

  res.json(schedule);
});

export default router;
