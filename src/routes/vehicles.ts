import express from "express";
import { vehiclesController } from "../controllers/index";
import { authGuard } from "../middlewares/authGuard";

const vehiclesRouter = express.Router();

vehiclesRouter.post(
  "/",
  authGuard(["admin", "fleet-manager"]),
  vehiclesController.create
);
vehiclesRouter.get(
  "/",
  authGuard([
    "admin",
    "fleet-manager",
    "inventory-manager",
    "inventory-in-charge",
    "captain",
  ]),
  vehiclesController.retrieveAll
);
vehiclesRouter.get(
  "/:vin",
  authGuard([
    "admin",
    "fleet-manager",
    "inventory-manager",
    "inventory-in-charge",
    "captain",
  ]),
  vehiclesController.retrieveByVIN
);
vehiclesRouter.put(
  "/:vin",
  authGuard(["admin", "fleet-manager"]),
  vehiclesController.updateByVIN
);
vehiclesRouter.delete(
  "/:vin",
  authGuard(["admin", "fleet-manager"]),
  vehiclesController.deleteByVIN
);

export { vehiclesRouter };
