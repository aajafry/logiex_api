import express from "express";
import { vendorsController } from "../controllers/index.js";
import { authGuard } from "../middlewares/authGuard.js";

const vendorsRouter = express.Router();

vendorsRouter.post(
  "/",
  authGuard(["admin", "procurement-manager"]),
  vendorsController.create
);
vendorsRouter.get(
  "/",
  authGuard([
    "admin",
    "procurement-manager",
    "inventory-manager",
  ]),
  vendorsController.retrieveAll
);
vendorsRouter.get(
  "/:name",
  authGuard([
    "admin",
    "procurement-manager",
    "inventory-manager",
  ]),
  vendorsController.retrieveByName
);
vendorsRouter.put(
  "/:name",
  authGuard(["admin", "procurement-manager"]),
  vendorsController.updateByName
);
vendorsRouter.delete(
  "/:name",
  authGuard(["admin", "procurement-manager"]),
  vendorsController.deleteByName
);

export { vendorsRouter };

