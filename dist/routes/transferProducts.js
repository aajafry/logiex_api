"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferProductsRouter = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("../controllers/index");
const authGuard_1 = require("../middlewares/authGuard");
const transferProductsRouter = express_1.default.Router();
exports.transferProductsRouter = transferProductsRouter;
transferProductsRouter.get("/", (0, authGuard_1.authGuard)(["admin", "inventory-manager", "inventory-in-charge"]), index_1.transferProductsController.retrieveAll);
transferProductsRouter.get("/:id", (0, authGuard_1.authGuard)(["admin", "inventory-manager", "inventory-in-charge"]), index_1.transferProductsController.retrieveById);
transferProductsRouter.put("/:id", (0, authGuard_1.authGuard)(["admin", "inventory-manager", "inventory-in-charge"]), index_1.transferProductsController.updateById);
transferProductsRouter.delete("/:id", (0, authGuard_1.authGuard)(["admin", "inventory-manager"]), index_1.transferProductsController.deleteById);
