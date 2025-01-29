"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = exports.insertCategorySchema = void 0;
const drizzle_zod_1 = require("drizzle-zod");
const zod_1 = require("zod");
const index_1 = require("../index");
exports.insertCategorySchema = (0, drizzle_zod_1.createInsertSchema)(index_1.categories, {
    name: zod_1.z
        .string({
        required_error: "Name is required",
    })
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(80, { message: "Name must not exceed 80 characters" }),
    description: zod_1.z
        .string()
        .max(750, { message: "Description must not exceed 750 characters" })
        .optional(),
});
exports.updateCategorySchema = (0, drizzle_zod_1.createInsertSchema)(index_1.categories, {
    name: zod_1.z
        .string()
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(80, { message: "Name must not exceed 80 characters" })
        .optional(),
    description: zod_1.z
        .string()
        .max(750, { message: "Description must not exceed 750 characters" })
        .optional(),
});
