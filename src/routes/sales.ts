import express from "express";
import { salesController } from "../controllers/index";
import { authGuard } from "../middlewares/authGuard";

const salesRouter = express.Router();

salesRouter.post(
  "/",
  authGuard(["admin", "inventory-manager", "inventory-in-charge"]),
  salesController.create
);
salesRouter.get(
  "/",
  authGuard([
    "admin",
    "fleet-manager",
    "inventory-manager",
    "inventory-in-charge",
    "captain",
  ]),
  salesController.retrieveAll
);
salesRouter.get(
  "/:billId",
  authGuard([
    "admin",
    "fleet-manager",
    "inventory-manager",
    "inventory-in-charge",
    "captain",
  ]),
  salesController.retrieveByBillId
);
salesRouter.put(
  "/:billId",
  authGuard(["admin", "inventory-manager", "inventory-in-charge"]),
  salesController.updateByBillId
);
salesRouter.delete(
  "/:billId",
  authGuard(["admin", "inventory-manager"]),
  salesController.deleteByBillId
);

export { salesRouter };
