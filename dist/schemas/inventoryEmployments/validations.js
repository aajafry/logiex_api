"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInventoryEmploymentSchema = exports.insertInventoryEmploymentSchema = void 0;
const drizzle_zod_1 = require("drizzle-zod");
const zod_1 = require("zod");
const index_1 = require("../index");
exports.insertInventoryEmploymentSchema = (0, drizzle_zod_1.createInsertSchema)(index_1.inventoryEmployments, {
    hire_date: zod_1.z.coerce.date({ message: "Invalid date" }).optional(),
    employee_id: zod_1.z
        .string({
        required_error: "Employee ID is required",
    })
        .uuid({ message: "Invalid employee ID" }),
    inventory: zod_1.z
        .string({
        required_error: "Inventory name is required",
    })
        .max(80, { message: "Inventory name must not exceed 80 characters" })
        .nonempty({ message: "Inventory name is required" }),
});
exports.updateInventoryEmploymentSchema = (0, drizzle_zod_1.createInsertSchema)(index_1.inventoryEmployments, {
    transfer_date: zod_1.z.coerce.date({ message: "Invalid date" }).optional(),
    resign_date: zod_1.z.coerce.date({ message: "Invalid date" }).optional(),
    termination_date: zod_1.z.coerce.date({ message: "Invalid date" }).optional(),
})
    .omit({
    employee_id: true,
    inventory: true,
    hire_date: true,
});
