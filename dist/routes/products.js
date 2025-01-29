"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsRouter = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("../controllers/index");
const authGuard_1 = require("../middlewares/authGuard");
const productsRouter = express_1.default.Router();
exports.productsRouter = productsRouter;
productsRouter.post("/", (0, authGuard_1.authGuard)(["admin", "procurement-manager", "inventory-manager"]), index_1.productsController.create);
productsRouter.get("/", (0, authGuard_1.authGuard)([
    "admin",
    "procurement-manager",
    "inventory-manager",
    "inventory-in-charge",
]), index_1.productsController.retrieveAll);
productsRouter.get("/:name", (0, authGuard_1.authGuard)([
    "admin",
    "procurement-manager",
    "inventory-manager",
    "inventory-in-charge",
]), index_1.productsController.retrieveByName);
productsRouter.put("/:name", (0, authGuard_1.authGuard)(["admin", "procurement-manager", "inventory-manager"]), index_1.productsController.updateByName);
productsRouter.delete("/:name", (0, authGuard_1.authGuard)(["admin", "procurement-manager", "inventory-manager"]), index_1.productsController.deleteByName);
