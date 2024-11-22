import express from "express";
import { categoriesController } from "../controllers/index.js";
import { authGuard } from "../middlewares/authGuard.js";

const categoriesRouter = express.Router();

categoriesRouter.post(
  "/",
  authGuard(["admin", "procurement-manager", "inventory-manager"]),
  categoriesController.create
);
categoriesRouter.get(
  "/",
  authGuard([
    "admin",
    "procurement-manager",
    "inventory-manager",
    "inventory-in-charge",
  ]),
  categoriesController.retrieveAll
);
categoriesRouter.get(
  "/:name",
  authGuard([
    "admin",
    "procurement-manager",
    "inventory-manager",
    "inventory-in-charge",
  ]),
  categoriesController.retrieveByName
);
categoriesRouter.put(
  "/:name",
  authGuard(["admin", "procurement-manager", "inventory-manager"]),
  categoriesController.updateByName
);
categoriesRouter.delete(
  "/:name",
  authGuard(["admin", "procurement-manager", "inventory-manager"]),
  categoriesController.deleteByName
);

export { categoriesRouter };
