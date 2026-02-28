import { Router } from "express";
import * as controller from "../controllers/catalogController";
import { requireMolamJwt, requireRole } from "../middleware/auth";

const router = Router();

router.post("/restaurants", requireMolamJwt, controller.createRestaurant);
router.get("/restaurants/:id", controller.getRestaurant);
router.put("/restaurants/:id", requireMolamJwt, controller.updateRestaurant);
router.delete("/restaurants/:id", requireMolamJwt, requireRole(["admin", "restaurant_owner"]), controller.deleteRestaurant);

router.post("/restaurants/:restId/categories", requireMolamJwt, controller.createCategory);
router.put("/categories/:id", requireMolamJwt, controller.updateCategory);
router.delete("/categories/:id", requireMolamJwt, controller.deleteCategory);

router.post("/restaurants/:restId/items", requireMolamJwt, controller.createItem);
router.get("/items/:id", controller.getItem);
router.put("/items/:id", requireMolamJwt, controller.updateItem);
router.delete("/items/:id", requireMolamJwt, controller.deleteItem);

router.post("/items/:itemId/variants", requireMolamJwt, controller.createVariant);
router.put("/variants/:id", requireMolamJwt, controller.updateVariant);
router.delete("/variants/:id", requireMolamJwt, controller.deleteVariant);

router.get("/restaurants/:restId/menu", controller.getRestaurantMenu);
router.get("/items", controller.searchItems);

export default router;
