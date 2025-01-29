"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTransferSchema = exports.insertTransferSchema = void 0;
const zod_1 = require("zod");
const drizzle_zod_1 = require("drizzle-zod");
const index_1 = require("../index");
exports.insertTransferSchema = (0, drizzle_zod_1.createInsertSchema)(index_1.transfers, {
    trf_id: zod_1.z
        .string({
        required_error: "TRF ID is required",
    })
        .min(6, { message: "TRF ID be at least 6 characters long" })
        .max(20, { message: "TRF ID must not exceed 20 characters" }),
    transfer_date: zod_1.z.coerce.date({ message: "Invalid date" }).optional(),
    source_inventory: zod_1.z
        .string({
        required_error: "Source inventory name is required",
    })
        .max(80, { message: "Source inventory name must not exceed 80 characters" })
        .nonempty({ message: "Source inventory name is required" }),
    destination_inventory: zod_1.z
        .string({
        required_error: "Destination inventory is required",
    })
        .max(80, {
        message: "Destination inventory name must not exceed 80 characters",
    })
        .nonempty({ message: "Destination inventory name is required" }),
});
exports.updateTransferSchema = (0, drizzle_zod_1.createInsertSchema)(index_1.transfers, {
    trf_id: zod_1.z
        .string({
        required_error: "TRF ID is required",
    })
        .min(6, { message: "TRF ID be at least 6 characters long" })
        .max(20, { message: "TRF ID must not exceed 20 characters" })
        .optional(),
    transfer_date: zod_1.z.coerce.date({ message: "Invalid date" }).optional(),
    source_inventory: zod_1.z
        .string({
        required_error: "Source inventory name is required",
    })
        .max(80, { message: "Source inventory name must not exceed 80 characters" })
        .optional(),
    destination_inventory: zod_1.z
        .string({
        required_error: "Destination inventory is required",
    })
        .max(80, {
        message: "Destination inventory name must not exceed 80 characters",
    })
        .optional(),
});
