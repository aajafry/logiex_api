"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorsRouter = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("../controllers/index");
const authGuard_1 = require("../middlewares/authGuard");
const vendorsRouter = express_1.default.Router();
exports.vendorsRouter = vendorsRouter;
vendorsRouter.post("/", (0, authGuard_1.authGuard)(["admin", "procurement-manager"]), index_1.vendorsController.create);
vendorsRouter.get("/", (0, authGuard_1.authGuard)([
    "admin",
    "procurement-manager",
    "inventory-manager",
]), index_1.vendorsController.retrieveAll);
vendorsRouter.get("/:name", (0, authGuard_1.authGuard)([
    "admin",
    "procurement-manager",
    "inventory-manager",
]), index_1.vendorsController.retrieveByName);
vendorsRouter.put("/:name", (0, authGuard_1.authGuard)(["admin", "procurement-manager"]), index_1.vendorsController.updateByName);
vendorsRouter.delete("/:name", (0, authGuard_1.authGuard)(["admin", "procurement-manager"]), index_1.vendorsController.deleteByName);
