import express from "express";
import { purchaseProductsController } from "../controllers/index";
import { authGuard } from "../middlewares/authGuard";

const purchaseProductsRouter = express.Router();

purchaseProductsRouter.get(
  "/",
  authGuard([
    "admin",
    "procurement-manager",
    "inventory-manager",
    "inventory-in-charge",
  ]),
  purchaseProductsController.retrieveAll
);
purchaseProductsRouter.get(
  "/:id",
  authGuard([
    "admin",
    "procurement-manager",
    "inventory-manager",
    "inventory-in-charge",
  ]),
  purchaseProductsController.retrieveById
);
purchaseProductsRouter.put(
  "/:id",
  authGuard(["admin", "procurement-manager"]),
  purchaseProductsController.updateById
);
purchaseProductsRouter.delete(
  "/:id",
  authGuard(["admin"]),
  purchaseProductsController.deleteById
);

export { purchaseProductsRouter };
