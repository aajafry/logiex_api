"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesRouter = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("../controllers/index");
const authGuard_1 = require("../middlewares/authGuard");
const categoriesRouter = express_1.default.Router();
exports.categoriesRouter = categoriesRouter;
categoriesRouter.post("/", (0, authGuard_1.authGuard)(["admin", "procurement-manager", "inventory-manager"]), index_1.categoriesController.create);
categoriesRouter.get("/", (0, authGuard_1.authGuard)([
    "admin",
    "procurement-manager",
    "inventory-manager",
    "inventory-in-charge",
]), index_1.categoriesController.retrieveAll);
categoriesRouter.get("/:name", (0, authGuard_1.authGuard)([
    "admin",
    "procurement-manager",
    "inventory-manager",
    "inventory-in-charge",
]), index_1.categoriesController.retrieveByName);
categoriesRouter.put("/:name", (0, authGuard_1.authGuard)(["admin", "procurement-manager", "inventory-manager"]), index_1.categoriesController.updateByName);
categoriesRouter.delete("/:name", (0, authGuard_1.authGuard)(["admin", "procurement-manager", "inventory-manager"]), index_1.categoriesController.deleteByName);
