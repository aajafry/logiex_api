"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customersRouter = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("../controllers/index");
const authGuard_1 = require("../middlewares/authGuard");
const customersRouter = express_1.default.Router();
exports.customersRouter = customersRouter;
customersRouter.post("/", (0, authGuard_1.authGuard)(["admin", "inventory-manager", "inventory-in-charge"]), index_1.customersController.create);
customersRouter.get("/", (0, authGuard_1.authGuard)([
    "admin",
    "inventory-manager",
    "inventory-in-charge",
    "fleet-manager",
    "captain",
]), index_1.customersController.retrieveAll);
customersRouter.get("/:id", (0, authGuard_1.authGuard)([
    "admin",
    "inventory-manager",
    "inventory-in-charge",
    "fleet-manager",
    "captain",
]), index_1.customersController.retrieveById);
customersRouter.put("/:id", (0, authGuard_1.authGuard)(["admin", "inventory-manager", "inventory-in-charge"]), index_1.customersController.updateById);
customersRouter.delete("/:id", (0, authGuard_1.authGuard)(["admin"]), index_1.customersController.deleteById);
