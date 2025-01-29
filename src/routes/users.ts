import express from "express";
import { usersController } from "../controllers/index";
import { authGuard } from "../middlewares/authGuard";

const usersRouter = express.Router();

usersRouter.post(
  "/",
  authGuard(["admin", "fleet-manager", "inventory-manager"]),
  usersController.create
);
usersRouter.get(
  "/",
  authGuard([
    "admin",
    "fleet-manager",
    "inventory-manager",
    "inventory-manager",
    "inventory-in-charge",
    "captain",
  ]),
  usersController.retrieveAll
);
usersRouter.get(
  "/:id",
  authGuard([
    "admin",
    "procurement-manager",
    "fleet-manager",
    "inventory-manager",
    "inventory-in-charge",
    "captain",
  ]),
  usersController.retrieveById
);
usersRouter.put(
  "/:id",
  authGuard([
    "admin",
    "procurement-manager",
    "fleet-manager",
    "inventory-manager",
    "inventory-in-charge",
    "captain",
  ]),
  usersController.updateById
);
usersRouter.delete("/:id", authGuard(["admin"]), usersController.deleteById);

export { usersRouter };
