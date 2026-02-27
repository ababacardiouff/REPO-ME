import { Router } from "express";
import { addItem, getCart } from "./controllers/cart.controller";
import { searchProducts, zeroQuerySuggestions } from "./controllers/search.controller";
import { FatimaRecommendation } from "./services/Fatima-recommendation.service";

export const routes = Router();

routes.post("/api/cart/add", addItem);
routes.get("/api/cart/:userId", getCart);
routes.get("/api/search", searchProducts);
routes.get("/api/search/zero-query", zeroQuerySuggestions);
routes.get("/api/recommendations", async (req, res) => {
  const { userId = "", context = "cart" } = req.query as { userId: string; context: "cart" | "search" };
  const data = await FatimaRecommendation(userId, context).catch(() => []);
  res.json(data);
});
