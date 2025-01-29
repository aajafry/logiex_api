"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.insertProductSchema = void 0;
const drizzle_zod_1 = require("drizzle-zod");
const zod_1 = require("zod");
const priceValidation_1 = require("../../utils/priceValidation");
const index_1 = require("../index");
exports.insertProductSchema = (0, drizzle_zod_1.createInsertSchema)(index_1.products, {
    name: zod_1.z
        .string({
        required_error: "Product name is required",
    })
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(80, { message: "Name must not exceed 80 characters" }),
    description: zod_1.z
        .string()
        .max(750, { message: "Description must not exceed 750 characters" })
        .optional(),
    price: zod_1.z
        .number({
        required_error: "Product price is required",
        invalid_type_error: "Product price must be a Number",
    })
        .refine((value) => value !== undefined && value !== null, {
        message: "Price is required",
    })
        .refine((value) => (0, priceValidation_1.priceValidation)(value), {
        message: "Price must have a maximum of 10 digits in total and 3 digits after the decimal point",
    }),
    category: zod_1.z
        .string({
        required_error: "Category name is required",
    })
        .max(80, { message: "category name must not exceed 80 characters" })
        .nonempty({ message: "category name is required" }),
    sku: zod_1.z
        .string({
        required_error: "SKU is required",
    })
        .min(6, { message: "SKU be at least 6 characters long" })
        .max(20, { message: "SKU must not exceed 20 characters" }),
});
exports.updateProductSchema = (0, drizzle_zod_1.createInsertSchema)(index_1.products, {
    name: zod_1.z
        .string()
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(80, { message: "Name must not exceed 80 characters" })
        .optional(),
    description: zod_1.z
        .string()
        .max(750, { message: "Description must not exceed 750 characters" })
        .optional(),
    price: zod_1.z
        .number()
        .optional()
        .refine((value) => {
        if (value === undefined || isNaN(value))
            return true;
        return (0, priceValidation_1.priceValidation)(value);
    }, {
        message: "Price must have a maximum of 10 digits in total and 3 digits after the decimal point",
    }),
    category: zod_1.z
        .string()
        .max(80, { message: "category name must not exceed 80 characters" })
        .optional(),
    sku: zod_1.z
        .string()
        .min(6, { message: "SKU be at least 6 characters long" })
        .max(20, { message: "SKU must not exceed 20 characters" })
        .optional(),
});
