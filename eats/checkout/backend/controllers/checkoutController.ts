import { Request, Response } from "express";
import checkoutService from "../services/checkoutService";

export const createCheckout = async (req: Request, res: Response) => {
  try {
    const result = await checkoutService.processCheckout(req.body);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
