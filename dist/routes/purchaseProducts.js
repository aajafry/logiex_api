"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseProductsRouter = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("../controllers/index");
const authGuard_1 = require("../middlewares/authGuard");
const purchaseProductsRouter = express_1.default.Router();
exports.purchaseProductsRouter = purchaseProductsRouter;
purchaseProductsRouter.get("/", (0, authGuard_1.authGuard)([
    "admin",
    "procurement-manager",
    "inventory-manager",
    "inventory-in-charge",
]), index_1.purchaseProductsController.retrieveAll);
purchaseProductsRouter.get("/:id", (0, authGuard_1.authGuard)([
    "admin",
    "procurement-manager",
    "inventory-manager",
    "inventory-in-charge",
]), index_1.purchaseProductsController.retrieveById);
purchaseProductsRouter.put("/:id", (0, authGuard_1.authGuard)(["admin", "procurement-manager"]), index_1.purchaseProductsController.updateById);
purchaseProductsRouter.delete("/:id", (0, authGuard_1.authGuard)(["admin"]), index_1.purchaseProductsController.deleteById);
