import express from "express";
import { transfersController } from "../controllers/index.js";
import { authGuard } from "../middlewares/authGuard.js";

const transfersRouter = express.Router();

transfersRouter.post(
  "/",
  authGuard(["admin", "inventory-manager", "inventory-in-charge"]),
  transfersController.create
);
transfersRouter.get(
  "/",
  authGuard(["admin", "inventory-manager", "inventory-in-charge"]),
  transfersController.retrieveAll
);
transfersRouter.get(
  "/:trfId",
  authGuard(["admin", "inventory-manager", "inventory-in-charge"]),
  transfersController.retrieveByTrfId
);
transfersRouter.put(
  "/:trfId",
  authGuard(["admin", "inventory-manager", "inventory-in-charge"]),
  transfersController.updateByTrfId
);
transfersRouter.delete(
  "/:trfId",
  authGuard(["admin", "inventory-manager"]),
  transfersController.deleteByTrfId
);

export { transfersRouter };
