"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVendorSchema = exports.insertVendorSchema = void 0;
const zod_1 = require("zod");
const drizzle_zod_1 = require("drizzle-zod");
const index_1 = require("../index");
exports.insertVendorSchema = (0, drizzle_zod_1.createInsertSchema)(index_1.vendors, {
    name: zod_1.z
        .string({
        required_error: "Vendor name is required",
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
    address: zod_1.z
        .string()
        .max(255, { message: "Address must not exceed 255 characters" })
        .optional(),
});
exports.updateVendorSchema = (0, drizzle_zod_1.createInsertSchema)(index_1.vendors, {
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
    address: zod_1.z
        .string()
        .max(255, { message: "Address must not exceed 255 characters" })
        .optional(),
});
