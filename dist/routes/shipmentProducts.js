"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shipmentProductsRouter = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("../controllers/index");
const authGuard_1 = require("../middlewares/authGuard");
const shipmentProductsRouter = express_1.default.Router();
exports.shipmentProductsRouter = shipmentProductsRouter;
shipmentProductsRouter.get("/", (0, authGuard_1.authGuard)([
    "admin",
    "fleet-manager",
    "inventory-manager",
    "inventory-in-charge",
    "captain",
]), index_1.shipmentProductsController.retrieveAll);
shipmentProductsRouter.get("/:id", (0, authGuard_1.authGuard)([
    "admin",
    "fleet-manager",
    "inventory-manager",
    "inventory-in-charge",
    "captain",
]), index_1.shipmentProductsController.retrieveById);
shipmentProductsRouter.put("/:id", (0, authGuard_1.authGuard)(["admin", "inventory-manager", "inventory-in-charge"]), index_1.shipmentProductsController.updateById);
shipmentProductsRouter.delete("/:id", (0, authGuard_1.authGuard)(["admin", "inventory-manager"]), index_1.shipmentProductsController.deleteById);
