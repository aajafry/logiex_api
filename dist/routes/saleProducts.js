"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saleProductsRouter = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("../controllers/index");
const authGuard_1 = require("../middlewares/authGuard");
const saleProductsRouter = express_1.default.Router();
exports.saleProductsRouter = saleProductsRouter;
saleProductsRouter.get("/", (0, authGuard_1.authGuard)([
    "admin",
    "fleet-manager",
    "inventory-manager",
    "inventory-in-charge",
    "captain",
]), index_1.saleProductsController.retrieveAll);
saleProductsRouter.get("/:id", (0, authGuard_1.authGuard)([
    "admin",
    "fleet-manager",
    "inventory-manager",
    "inventory-in-charge",
    "captain",
]), index_1.saleProductsController.retrieveById);
saleProductsRouter.put("/:id", (0, authGuard_1.authGuard)(["admin", "inventory-manager", "inventory-in-charge"]), index_1.saleProductsController.updateById);
saleProductsRouter.delete("/:id", (0, authGuard_1.authGuard)(["admin", "inventory-manager"]), index_1.saleProductsController.deleteById);
