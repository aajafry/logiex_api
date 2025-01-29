"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoriesRouter = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("../controllers/index");
const authGuard_1 = require("../middlewares/authGuard");
const inventoriesRouter = express_1.default.Router();
exports.inventoriesRouter = inventoriesRouter;
inventoriesRouter.post("/", (0, authGuard_1.authGuard)(["admin", "inventory-manager"]), index_1.inventoriesController.create);
inventoriesRouter.get("/", (0, authGuard_1.authGuard)([
    "admin",
    "procurement-manager",
    "inventory-manager",
    "inventory-in-charge",
]), index_1.inventoriesController.retrieveAll);
inventoriesRouter.get("/:name", (0, authGuard_1.authGuard)([
    "admin",
    "procurement-manager",
    "inventory-manager",
    "inventory-in-charge",
]), index_1.inventoriesController.retrieveByName);
inventoriesRouter.put("/:name", (0, authGuard_1.authGuard)(["admin", "inventory-manager"]), index_1.inventoriesController.updateByName);
inventoriesRouter.delete("/:name", (0, authGuard_1.authGuard)(["admin"]), index_1.inventoriesController.deleteByName);
