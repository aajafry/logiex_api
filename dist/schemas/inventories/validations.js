"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInventorySchema = exports.insertInventorySchema = void 0;
const drizzle_zod_1 = require("drizzle-zod");
const zod_1 = require("zod");
const index_1 = require("../index");
exports.insertInventorySchema = (0, drizzle_zod_1.createInsertSchema)(index_1.inventories, {
    name: zod_1.z
        .string({
        required_error: "Name is required",
    })
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(80, { message: "Name must not exceed 80 characters" }),
    email: zod_1.z
        .string()
        .email({ message: "Invalid email address" })
        .max(150, { message: "Email must not exceed 150 characters" })
        .optional(),
    phone: zod_1.z
        .string()
        .min(10, { message: "Phone number must be at least 10 digits long" })
        .max(16, { message: "Phone number must not exceed 16 digits" })
        .optional(),
    description: zod_1.z
        .string()
        .max(750, { message: "Description must not exceed 750 characters" })
        .optional(),
    address: zod_1.z
        .string({
        required_error: "Address is required",
    })
        .max(255, { message: "Address must not exceed 255 characters" }),
});
exports.updateInventorySchema = (0, drizzle_zod_1.createInsertSchema)(index_1.inventories, {
    name: zod_1.z
        .string()
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(80, { message: "Name must not exceed 80 characters" })
        .optional(),
    email: zod_1.z
        .string()
        .email({ message: "Invalid email address" })
        .max(150, { message: "Email must not exceed 150 characters" })
        .optional(),
    phone: zod_1.z
        .string()
        .min(10, { message: "Phone number must be at least 10 digits long" })
        .max(16, { message: "Phone number must not exceed 16 digits" })
        .optional(),
    description: zod_1.z
        .string()
        .max(750, { message: "Description must not exceed 750 characters" })
        .optional(),
    address: zod_1.z
        .string()
        .max(255, { message: "Address must not exceed 255 characters" })
        .optional(),
});
