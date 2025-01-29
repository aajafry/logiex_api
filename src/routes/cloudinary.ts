import express from "express";
import { cloudinaryController } from "../controllers/index";
import { authGuard } from "../middlewares/authGuard";

const cloudinaryRouter = express.Router();

cloudinaryRouter.post(
  "/delete-image",
  authGuard([
    "admin",
    "procurement-manager",
    "fleet-manager",
    "inventory-manager",
    "inventory-in-charge",
    "captain",
    "guest",
  ]),
  cloudinaryController.delete
);

export { cloudinaryRouter };
