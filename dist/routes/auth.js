"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("../controllers/index");
const authRouter = express_1.default.Router();
exports.authRouter = authRouter;
authRouter.post("/register", index_1.authController.register);
authRouter.post("/login", index_1.authController.login);
authRouter.post("/request-password-reset", index_1.authController.requestPasswordReset);
authRouter.post("/reset-password", index_1.authController.resetPassword);
authRouter.post("/logout/:id", index_1.authController.logout);
