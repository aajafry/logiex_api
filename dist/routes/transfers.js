"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transfersRouter = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("../controllers/index");
const authGuard_1 = require("../middlewares/authGuard");
const transfersRouter = express_1.default.Router();
exports.transfersRouter = transfersRouter;
transfersRouter.post("/", (0, authGuard_1.authGuard)(["admin", "inventory-manager", "inventory-in-charge"]), index_1.transfersController.create);
transfersRouter.get("/", (0, authGuard_1.authGuard)(["admin", "inventory-manager", "inventory-in-charge"]), index_1.transfersController.retrieveAll);
transfersRouter.get("/:trfId", (0, authGuard_1.authGuard)(["admin", "inventory-manager", "inventory-in-charge"]), index_1.transfersController.retrieveByTrfId);
transfersRouter.put("/:trfId", (0, authGuard_1.authGuard)(["admin", "inventory-manager", "inventory-in-charge"]), index_1.transfersController.updateByTrfId);
transfersRouter.delete("/:trfId", (0, authGuard_1.authGuard)(["admin", "inventory-manager"]), index_1.transfersController.deleteByTrfId);
