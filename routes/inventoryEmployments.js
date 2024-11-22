import express from "express";
import { inventoryEmploymentsController } from "../controllers/index.js";
import { authGuard } from "../middlewares/authGuard.js";

const inventoryEmploymentsRouter = express.Router();

inventoryEmploymentsRouter.post(
  "/",
  authGuard(["admin", "inventory-manager"]),
  inventoryEmploymentsController.create
);
inventoryEmploymentsRouter.get(
  "/",
  authGuard(["admin", "inventory-manager", "inventory-in-charge"]),
  inventoryEmploymentsController.retrieveAll
);
inventoryEmploymentsRouter.get(
  "/:id",
  authGuard(["admin", "inventory-manager", "inventory-in-charge"]),
  inventoryEmploymentsController.retrieveById
);
inventoryEmploymentsRouter.put(
  "/:id",
  authGuard(["admin", "inventory-manager"]),
  inventoryEmploymentsController.updateById
);
inventoryEmploymentsRouter.delete(
  "/:id",
  authGuard(["admin"]),
  inventoryEmploymentsController.deleteById
);

export { inventoryEmploymentsRouter };
