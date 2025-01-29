"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSaleSchema = exports.insertSaleSchema = void 0;
const drizzle_zod_1 = require("drizzle-zod");
const zod_1 = require("zod");
const priceValidation_1 = require("../../utils/priceValidation");
const index_1 = require("../index");
const enum_1 = require("../../utils/enum");
exports.insertSaleSchema = (0, drizzle_zod_1.createInsertSchema)(index_1.sales, {
    bill_id: zod_1.z
        .string({
        required_error: "Bill ID is required",
    })
        .max(20, { message: "BILL ID must not exceed 20 characters" })
        .nonempty({ message: "BILL ID is required" }),
    sale_date: zod_1.z.coerce.date({ message: "Invalid date" }).optional(),
    customer_id: zod_1.z
        .string({
        required_error: "Customer ID is required",
    })
        .uuid({ message: "Invalid customer ID" })
        .min(1, { message: "Customer ID is required" }),
    shipping_address: zod_1.z
        .string({
        required_error: "Shipping address is required",
    })
        .max(255, { message: "Address must not exceed 255 characters" })
        .nonempty({ message: "Address is required" }),
    status: zod_1.z.enum(enum_1.salesStatusEnum).optional(),
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
exports.updateSaleSchema = (0, drizzle_zod_1.createInsertSchema)(index_1.sales, {
    bill_id: zod_1.z
        .string()
        .max(20, { message: "BILL ID must not exceed 20 characters" })
        .optional(),
    sale_date: zod_1.z.coerce.date({ message: "Invalid date" }).optional(),
    customer_id: zod_1.z.string().uuid({ message: "Invalid customer ID" }).optional(),
    shipping_address: zod_1.z
        .string()
        .max(255, { message: "Address must not exceed 255 characters" })
        .optional(),
    inventory: zod_1.z
        .string()
        .max(80, { message: "Inventory name must not exceed 80 characters" })
        .optional(),
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
    status: zod_1.z.enum(enum_1.salesStatusEnum).optional(),
});
