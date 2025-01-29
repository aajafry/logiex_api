"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSaleProductSchema = exports.insertSaleProductSchema = void 0;
const drizzle_zod_1 = require("drizzle-zod");
const zod_1 = require("zod");
const priceValidation_1 = require("../../utils/priceValidation");
const index_1 = require("../index");
exports.insertSaleProductSchema = (0, drizzle_zod_1.createInsertSchema)(index_1.saleProducts, {
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
        .number({
        required_error: "Product quantity is required",
    })
        .positive({ message: "Product quantity must be a positive number" })
        .int({ message: "Product quantity must be an integer" }),
    unit_price: zod_1.z
        .number({
        required_error: "Product unit price is required",
    })
        .refine((value) => value !== undefined && value !== null, {
        message: "Unit price is required",
    })
        .refine((value) => (0, priceValidation_1.priceValidation)(value), {
        message: "Unit price must have a maximum of 10 digits in total and 3 digits after the decimal point",
    }),
    discount: zod_1.z
        .number()
        .gte(0, { message: "Discount must have a minimum of zero percent" })
        .lte(100, { message: "Discount must have a maximum of hundred percent" })
        .optional(),
}).omit({
    inventory: true,
    discount: true,
    mr_id: true,
    total_price: true,
});
exports.updateSaleProductSchema = (0, drizzle_zod_1.createInsertSchema)(index_1.saleProducts, {
    quantity: zod_1.z
        .number()
        .positive({ message: "Product quantity must be a positive number" })
        .int({ message: "Product quantity must be an integer" })
        .optional(),
    unit_price: zod_1.z
        .number()
        .optional()
        .refine((value) => {
        if (value === undefined || isNaN(value))
            return true;
        return (0, priceValidation_1.priceValidation)(value);
    }, {
        message: "Unit price must have a maximum of 10 digits in total and 3 digits after the decimal point",
    }),
    discount: zod_1.z
        .number()
        .gte(0, { message: "Discount must have a minimum of zero percent" })
        .lte(100, { message: "Discount must have a maximum of hundred percent" })
        .optional(),
}).omit({
    quantity: true,
    unit_price: true,
    discount: true,
});
