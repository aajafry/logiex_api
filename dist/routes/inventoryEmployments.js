"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryEmploymentsRouter = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("../controllers/index");
const authGuard_1 = require("../middlewares/authGuard");
const inventoryEmploymentsRouter = express_1.default.Router();
exports.inventoryEmploymentsRouter = inventoryEmploymentsRouter;
inventoryEmploymentsRouter.post("/", (0, authGuard_1.authGuard)(["admin", "inventory-manager"]), index_1.inventoryEmploymentsController.create);
inventoryEmploymentsRouter.get("/", (0, authGuard_1.authGuard)(["admin", "inventory-manager", "inventory-in-charge"]), index_1.inventoryEmploymentsController.retrieveAll);
inventoryEmploymentsRouter.get("/:id", (0, authGuard_1.authGuard)(["admin", "inventory-manager", "inventory-in-charge"]), index_1.inventoryEmploymentsController.retrieveById);
inventoryEmploymentsRouter.put("/:id", (0, authGuard_1.authGuard)(["admin", "inventory-manager"]), index_1.inventoryEmploymentsController.updateById);
inventoryEmploymentsRouter.delete("/:id", (0, authGuard_1.authGuard)(["admin"]), index_1.inventoryEmploymentsController.deleteById);
