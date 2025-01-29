"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInventoryProductSchema = exports.insertInventoryProductSchema = void 0;
const drizzle_zod_1 = require("drizzle-zod");
const zod_1 = require("zod");
const index_1 = require("../index");
exports.insertInventoryProductSchema = (0, drizzle_zod_1.createInsertSchema)(index_1.inventoryProducts, {
    mr_id: zod_1.z
        .string({
        required_error: "MR ID is required",
    })
        .max(20, { message: "MR ID must not exceed 20 characters" })
        .nonempty({ message: "MR ID is required" }),
    inventory: zod_1.z
        .string({
        required_error: "Inventory name is required",
    })
        .max(80, { message: "Inventory name must not exceed 80 characters" })
        .nonempty({ message: "Inventory name is required" }),
    product: zod_1.z
        .string({
        required_error: "Product name is required",
    })
        .max(80, { message: "Product name must not exceed 80 characters" })
        .nonempty({ message: "Product name is required" }),
    quantity: zod_1.z
        .number()
        .positive({ message: "Product quantity must be a positive number" })
        .int({ message: "Product quantity must be an integer" }),
});
exports.updateInventoryProductSchema = (0, drizzle_zod_1.createInsertSchema)(index_1.inventoryProducts, {
    quantity: zod_1.z
        .number()
        .positive({ message: "Product quantity must be a positive number" })
        .int({ message: "Product quantity must be an integer" }),
});
