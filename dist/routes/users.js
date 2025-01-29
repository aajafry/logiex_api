"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("../controllers/index");
const authGuard_1 = require("../middlewares/authGuard");
const usersRouter = express_1.default.Router();
exports.usersRouter = usersRouter;
usersRouter.post("/", (0, authGuard_1.authGuard)(["admin", "fleet-manager", "inventory-manager"]), index_1.usersController.create);
usersRouter.get("/", (0, authGuard_1.authGuard)([
    "admin",
    "fleet-manager",
    "inventory-manager",
    "inventory-manager",
    "inventory-in-charge",
    "captain",
]), index_1.usersController.retrieveAll);
usersRouter.get("/:id", (0, authGuard_1.authGuard)([
    "admin",
    "procurement-manager",
    "fleet-manager",
    "inventory-manager",
    "inventory-in-charge",
    "captain",
]), index_1.usersController.retrieveById);
usersRouter.put("/:id", (0, authGuard_1.authGuard)([
    "admin",
    "procurement-manager",
    "fleet-manager",
    "inventory-manager",
    "inventory-in-charge",
    "captain",
]), index_1.usersController.updateById);
usersRouter.delete("/:id", (0, authGuard_1.authGuard)(["admin"]), index_1.usersController.deleteById);
