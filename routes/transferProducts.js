import express from "express";
import { transferProductsController } from "../controllers/index.js";
import { authGuard } from "../middlewares/authGuard.js";

const transferProductsRouter = express.Router();

transferProductsRouter.get(
  "/",
  authGuard(["admin", "inventory-manager", "inventory-in-charge"]),
  transferProductsController.retrieveAll
);
transferProductsRouter.get(
  "/:id",
  authGuard(["admin", "inventory-manager", "inventory-in-charge"]),
  transferProductsController.retrieveById
);
transferProductsRouter.put(
  "/:id",
  authGuard(["admin", "inventory-manager", "inventory-in-charge"]),
  transferProductsController.updateById
);
transferProductsRouter.delete(
  "/:id",
  authGuard(["admin", "inventory-manager"]),
  transferProductsController.deleteById
);

export { transferProductsRouter };
