import express from "express";
import { inventoriesController } from "../controllers/index";
import { authGuard } from "../middlewares/authGuard";

const inventoriesRouter = express.Router();

inventoriesRouter.post(
  "/",
  authGuard(["admin", "inventory-manager"]),
  inventoriesController.create
);
inventoriesRouter.get(
  "/",
  authGuard([
    "admin",
    "procurement-manager",
    "inventory-manager",
    "inventory-in-charge",
   
  ]),
  inventoriesController.retrieveAll
);
inventoriesRouter.get(
  "/:name",
  authGuard([
    "admin",
    "procurement-manager",
    "inventory-manager",
    "inventory-in-charge",
  ]),
  inventoriesController.retrieveByName
);
inventoriesRouter.put(
  "/:name",
  authGuard(["admin", "inventory-manager"]),
  inventoriesController.updateByName
);
inventoriesRouter.delete(
  "/:name",
  authGuard(["admin"]),
  inventoriesController.deleteByName
);

export { inventoriesRouter };
