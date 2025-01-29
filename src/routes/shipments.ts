import express from "express";
import { shipmentsController } from "../controllers/index";
import { authGuard } from "../middlewares/authGuard";

const shipmentsRouter = express.Router();

shipmentsRouter.post(
  "/",
  authGuard(["admin", "fleet-manager"]),
  shipmentsController.create
);
shipmentsRouter.get(
  "/",
  authGuard([
    "admin",
    "fleet-manager",
    "inventory-manager",
    "inventory-in-charge",
    "captain",
  ]),
  shipmentsController.retrieveAll
);
shipmentsRouter.get(
  "/:shipmentId",
  authGuard([
    "admin",
    "fleet-manager",
    "inventory-manager",
    "inventory-in-charge",
    "captain",
  ]),
  shipmentsController.retrieveByShipmentId
);
shipmentsRouter.put(
  "/:shipmentId",
  authGuard([
    "admin",
    "fleet-manager",
    "inventory-manager",
    "inventory-in-charge",
    "captain",
  ]),
  shipmentsController.updateByShipmentId
);
shipmentsRouter.delete(
  "/:shipmentId",
  authGuard(["admin", "fleet-manager"]),
  shipmentsController.deleteByShipmentId
);

export { shipmentsRouter };
