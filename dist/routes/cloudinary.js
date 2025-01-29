"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryRouter = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("../controllers/index");
const authGuard_1 = require("../middlewares/authGuard");
const cloudinaryRouter = express_1.default.Router();
exports.cloudinaryRouter = cloudinaryRouter;
cloudinaryRouter.post("/delete-image", (0, authGuard_1.authGuard)([
    "admin",
    "procurement-manager",
    "fleet-manager",
    "inventory-manager",
    "inventory-in-charge",
    "captain",
    "guest",
]), index_1.cloudinaryController.delete);
