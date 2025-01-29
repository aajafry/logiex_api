"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesRouter = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("../controllers/index");
const authGuard_1 = require("../middlewares/authGuard");
const salesRouter = express_1.default.Router();
exports.salesRouter = salesRouter;
salesRouter.post("/", (0, authGuard_1.authGuard)(["admin", "inventory-manager", "inventory-in-charge"]), index_1.salesController.create);
salesRouter.get("/", (0, authGuard_1.authGuard)([
    "admin",
    "fleet-manager",
    "inventory-manager",
    "inventory-in-charge",
    "captain",
]), index_1.salesController.retrieveAll);
salesRouter.get("/:billId", (0, authGuard_1.authGuard)([
    "admin",
    "fleet-manager",
    "inventory-manager",
    "inventory-in-charge",
    "captain",
]), index_1.salesController.retrieveByBillId);
salesRouter.put("/:billId", (0, authGuard_1.authGuard)(["admin", "inventory-manager", "inventory-in-charge"]), index_1.salesController.updateByBillId);
salesRouter.delete("/:billId", (0, authGuard_1.authGuard)(["admin", "inventory-manager"]), index_1.salesController.deleteByBillId);
