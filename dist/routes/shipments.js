"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shipmentsRouter = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("../controllers/index");
const authGuard_1 = require("../middlewares/authGuard");
const shipmentsRouter = express_1.default.Router();
exports.shipmentsRouter = shipmentsRouter;
shipmentsRouter.post("/", (0, authGuard_1.authGuard)(["admin", "fleet-manager"]), index_1.shipmentsController.create);
shipmentsRouter.get("/", (0, authGuard_1.authGuard)([
    "admin",
    "fleet-manager",
    "inventory-manager",
    "inventory-in-charge",
    "captain",
]), index_1.shipmentsController.retrieveAll);
shipmentsRouter.get("/:shipmentId", (0, authGuard_1.authGuard)([
    "admin",
    "fleet-manager",
    "inventory-manager",
    "inventory-in-charge",
    "captain",
]), index_1.shipmentsController.retrieveByShipmentId);
shipmentsRouter.put("/:shipmentId", (0, authGuard_1.authGuard)([
    "admin",
    "fleet-manager",
    "inventory-manager",
    "inventory-in-charge",
    "captain",
]), index_1.shipmentsController.updateByShipmentId);
shipmentsRouter.delete("/:shipmentId", (0, authGuard_1.authGuard)(["admin", "fleet-manager"]), index_1.shipmentsController.deleteByShipmentId);
