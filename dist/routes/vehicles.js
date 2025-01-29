"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehiclesRouter = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("../controllers/index");
const authGuard_1 = require("../middlewares/authGuard");
const vehiclesRouter = express_1.default.Router();
exports.vehiclesRouter = vehiclesRouter;
vehiclesRouter.post("/", (0, authGuard_1.authGuard)(["admin", "fleet-manager"]), index_1.vehiclesController.create);
vehiclesRouter.get("/", (0, authGuard_1.authGuard)([
    "admin",
    "fleet-manager",
    "inventory-manager",
    "inventory-in-charge",
    "captain",
]), index_1.vehiclesController.retrieveAll);
vehiclesRouter.get("/:vin", (0, authGuard_1.authGuard)([
    "admin",
    "fleet-manager",
    "inventory-manager",
    "inventory-in-charge",
    "captain",
]), index_1.vehiclesController.retrieveByVIN);
vehiclesRouter.put("/:vin", (0, authGuard_1.authGuard)(["admin", "fleet-manager"]), index_1.vehiclesController.updateByVIN);
vehiclesRouter.delete("/:vin", (0, authGuard_1.authGuard)(["admin", "fleet-manager"]), index_1.vehiclesController.deleteByVIN);
