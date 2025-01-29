"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePurchaseSchema = exports.insertPurchaseSchema = void 0;
const drizzle_zod_1 = require("drizzle-zod");
const zod_1 = require("zod");
const priceValidation_1 = require("../../utils/priceValidation");
const index_1 = require("../index");
exports.insertPurchaseSchema = (0, drizzle_zod_1.createInsertSchema)(index_1.purchases, {
    mr_id: zod_1.z
        .string({
        required_error: "MR ID is required",
    })
        .min(6, { message: "MR ID be at least 6 characters long" })
        .max(20, { message: "MR ID must not exceed 20 characters" }),
    purchase_date: zod_1.z.coerce.date({ message: "Invalid date" }).optional(),
    vendor: zod_1.z
        .string({
        required_error: "Vendor name is required",
    })
        .max(80, { message: "Vendor name must not exceed 80 characters" })
        .nonempty({ message: "Vendor name is required" }),
    inventory: zod_1.z
        .string({
        required_error: "Inventory name is required",
    })
        .max(80, { message: "Inventory name must not exceed 80 characters" })
        .nonempty({ message: "Inventory name is required" }),
    adjustment: zod_1.z
        .number()
        .optional()
        .refine((value) => {
        if (value === undefined || isNaN(value))
            return true;
        return (0, priceValidation_1.priceValidation)(value);
    }, {
        message: "Adjustment price must have a maximum of 10 digits in total and 3 digits after the decimal point",
    }),
});
exports.updatePurchaseSchema = (0, drizzle_zod_1.createInsertSchema)(index_1.purchases, {
    mr_id: zod_1.z
        .string()
        .min(6, { message: "MR ID be at least 6 characters long" })
        .max(20, { message: "MR ID must not exceed 20 characters" })
        .optional(),
    purchase_date: zod_1.z.coerce.date({ message: "Invalid date" }).optional(),
    vendor: zod_1.z
        .string()
        .max(80, { message: "Vendor name must not exceed 80 characters" })
        .optional(),
    inventory: zod_1.z
        .string()
        .max(80, { message: "Inventory name must not exceed 80 characters" })
        .optional(),
    adjustment: zod_1.z
        .number({
        invalid_type_error: "Product adjustment must be a Number",
    })
        .optional()
        .refine((value) => {
        if (value === undefined || isNaN(value))
            return true;
        return (0, priceValidation_1.priceValidation)(value);
    }, {
        message: "Adjustment price must have a maximum of 10 digits in total and 3 digits after the decimal point",
    }),
});
