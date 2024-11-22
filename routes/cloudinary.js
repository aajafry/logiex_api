import express from "express";
import { cloudinaryController } from "../controllers/index.js";
import { authGuard } from "../middlewares/authGuard.js";

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
