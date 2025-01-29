"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryProductsRouter = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("../controllers/index");
const authGuard_1 = require("../middlewares/authGuard");
const inventoryProductsRouter = express_1.default.Router();
exports.inventoryProductsRouter = inventoryProductsRouter;
inventoryProductsRouter.get("/", (0, authGuard_1.authGuard)([
    "admin",
    "procurement-manager",
    "inventory-manager",
    "inventory-in-charge",
]), index_1.inventoryProductsController.retrieveAll);
inventoryProductsRouter.get("/:id", (0, authGuard_1.authGuard)([
    "admin",
    "procurement-manager",
    "inventory-manager",
    "inventory-in-charge",
]), index_1.inventoryProductsController.retrieveById);
