"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchasesRouter = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("../controllers/index");
const authGuard_1 = require("../middlewares/authGuard");
const purchasesRouter = express_1.default.Router();
exports.purchasesRouter = purchasesRouter;
purchasesRouter.post("/", (0, authGuard_1.authGuard)(["admin", "procurement-manager"]), index_1.purchasesController.create);
purchasesRouter.get("/", (0, authGuard_1.authGuard)([
    "admin",
    "procurement-manager",
    "inventory-manager",
    "inventory-in-charge",
]), index_1.purchasesController.retrieveAll);
purchasesRouter.get("/:mrId", (0, authGuard_1.authGuard)([
    "admin",
    "procurement-manager",
    "inventory-manager",
    "inventory-in-charge",
]), index_1.purchasesController.retrieveByMrId);
purchasesRouter.put("/:mrId", (0, authGuard_1.authGuard)(["admin", "procurement-manager"]), index_1.purchasesController.updateByMrId);
purchasesRouter.delete("/:mrId", (0, authGuard_1.authGuard)(["admin"]), index_1.purchasesController.deleteByMrId);
