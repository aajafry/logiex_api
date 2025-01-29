import express from "express";
import { inventoryProductsController } from "../controllers/index";
import { authGuard } from "../middlewares/authGuard";

const inventoryProductsRouter = express.Router();

inventoryProductsRouter.get(
  "/",
  authGuard([
    "admin",
    "procurement-manager",
    "inventory-manager",
    "inventory-in-charge",
  ]),
  inventoryProductsController.retrieveAll
);
inventoryProductsRouter.get(
  "/:id",
  authGuard([
    "admin",
    "procurement-manager",
    "inventory-manager",
    "inventory-in-charge",
  ]),
  inventoryProductsController.retrieveById
);

export { inventoryProductsRouter };
