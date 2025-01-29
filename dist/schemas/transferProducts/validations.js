"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTransferProductSchema = exports.insertTransferProductSchema = void 0;
const drizzle_zod_1 = require("drizzle-zod");
const zod_1 = require("zod");
const index_1 = require("../index");
exports.insertTransferProductSchema = (0, drizzle_zod_1.createInsertSchema)(index_1.transferProducts, {
    mr_id: zod_1.z
        .string({
        required_error: "MR ID is required",
    })
        .min(6, { message: "MR ID be at least 6 characters long" })
        .max(20, { message: "MR ID must not exceed 20 characters" }),
    product: zod_1.z
        .string({
        required_error: "Product name is required",
    })
        .max(80, { message: "Product name must not exceed 80 characters" })
        .nonempty({ message: "Product name is required" }),
    quantity: zod_1.z
        .number({
        required_error: "Product quantity is required",
        invalid_type_error: "Product quantity must be a Number",
    })
        .positive({ message: "Product quantity must be a positive number" })
        .int({ message: "Product quantity must be an integer" }),
}).omit({
    trf_id: true,
});
exports.updateTransferProductSchema = (0, drizzle_zod_1.createInsertSchema)(index_1.transferProducts, {
    quantity: zod_1.z
        .number()
        .positive({ message: "Product quantity must be a positive number" })
        .int({ message: "Product quantity must be an integer" })
        .optional(),
}).omit({
    trf_id: true,
    product: true,
    mr_id: true,
});
