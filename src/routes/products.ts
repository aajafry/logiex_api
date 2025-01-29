import express from "express";
import { productsController } from "../controllers/index";
import { authGuard } from "../middlewares/authGuard";

const productsRouter = express.Router();

productsRouter.post(
  "/",
  authGuard(["admin", "procurement-manager", "inventory-manager"]),
  productsController.create
);
productsRouter.get(
  "/",
  authGuard([
    "admin",
    "procurement-manager",
    "inventory-manager",
    "inventory-in-charge",
  ]),
  productsController.retrieveAll
);
productsRouter.get(
  "/:name",
  authGuard([
    "admin",
    "procurement-manager",
    "inventory-manager",
    "inventory-in-charge",
  ]),
  productsController.retrieveByName
);
productsRouter.put(
  "/:name",
  authGuard(["admin", "procurement-manager", "inventory-manager"]),
  productsController.updateByName
);
productsRouter.delete(
  "/:name",
  authGuard(["admin", "procurement-manager", "inventory-manager"]),
  productsController.deleteByName
);

export { productsRouter };
