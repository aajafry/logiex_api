import express from "express";
import { authController } from "../controllers/index.js";

const authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/request-password-reset", authController.requestPasswordReset);
authRouter.post("/reset-password", authController.resetPassword);
authRouter.post("/logout/:id", authController.logout);

export { authRouter };
