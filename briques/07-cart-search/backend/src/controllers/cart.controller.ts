import { Request, Response } from "express";
import { cartService } from "../services/cart.service";

export const addItem = async (req: Request, res: Response) => {
  const { userId, productId, qty } = req.body;
  const cart = await cartService.addItem(userId, productId, qty);
  res.json(cart);
};

export const getCart = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const cart = await cartService.getActiveCart(userId);
  res.json(cart);
};
