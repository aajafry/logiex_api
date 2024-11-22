import express from "express";
import { saleProductsController } from "../controllers/index.js";
import { authGuard } from "../middlewares/authGuard.js";

const saleProductsRouter = express.Router();

saleProductsRouter.get(
  "/",
  authGuard([
    "admin",
    "fleet-manager",
    "inventory-manager",
    "inventory-in-charge",
    "captain",
  ]),
  saleProductsController.retrieveAll
);
saleProductsRouter.get(
  "/:id",
  authGuard([
    "admin",
    "fleet-manager",
    "inventory-manager",
    "inventory-in-charge",
    "captain",
  ]),
  saleProductsController.retrieveById
);
saleProductsRouter.put(
  "/:id",
  authGuard(["admin", "inventory-manager", "inventory-in-charge"]),
  saleProductsController.updateById
);
saleProductsRouter.delete(
  "/:id",
  authGuard(["admin", "inventory-manager"]),
  saleProductsController.deleteById
);

export { saleProductsRouter };
