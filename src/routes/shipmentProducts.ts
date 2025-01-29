import express from "express";
import { shipmentProductsController } from "../controllers/index";
import { authGuard } from "../middlewares/authGuard";

const shipmentProductsRouter = express.Router();

shipmentProductsRouter.get(
  "/",
  authGuard([
    "admin",
    "fleet-manager",
    "inventory-manager",
    "inventory-in-charge",
    "captain",
  ]),
  shipmentProductsController.retrieveAll
);
shipmentProductsRouter.get(
  "/:id",
  authGuard([
    "admin",
    "fleet-manager",
    "inventory-manager",
    "inventory-in-charge",
    "captain",
  ]),
  shipmentProductsController.retrieveById
);
shipmentProductsRouter.put(
  "/:id",
  authGuard(["admin", "inventory-manager", "inventory-in-charge"]),
  shipmentProductsController.updateById
);
shipmentProductsRouter.delete(
  "/:id",
  authGuard(["admin", "inventory-manager"]),
  shipmentProductsController.deleteById
);

export { shipmentProductsRouter };
