import { Request, Response } from "express";
import { searchService } from "../services/search.service";

export const searchProducts = async (req: Request, res: Response) => {
  const { query = "", userId = "" } = req.query as any;
  const results = await searchService.search(query, userId);
  res.json(results);
};

export const zeroQuerySuggestions = async (req: Request, res: Response) => {
  const { userId = "" } = req.query as any;
  const results = await searchService.zeroQuery(userId);
  res.json(results);
};
