"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateShipmentSchema = exports.insertShipmentSchema = void 0;
const drizzle_zod_1 = require("drizzle-zod");
const zod_1 = require("zod");
const enum_1 = require("../../utils/enum");
const index_1 = require("../index");
exports.insertShipmentSchema = (0, drizzle_zod_1.createInsertSchema)(index_1.shipments, {
    shipment_id: zod_1.z
        .string({
        required_error: "Shipment ID is required",
    })
        .max(20, { message: "Shipment ID must not exceed 20 characters" })
        .nonempty({ message: "Shipment ID is required" }),
    shipment_date: zod_1.z.coerce.date({ message: "Invalid date" }).optional(),
    vehicle_vin: zod_1.z
        .string({
        required_error: "Vehicle VIN is required",
    })
        .max(20, { message: "Vehicle VIN must not exceed 20 characters" })
        .nonempty({ message: "Vehicle VIN is required" }),
    captain_id: zod_1.z
        .string({
        required_error: "Captain ID is required",
    })
        .uuid({ message: "Invalid captain ID" })
        .min(1, { message: "Captain ID is required" }),
    status: zod_1.z.enum(enum_1.shipmentStatusEnum).optional(),
});
exports.updateShipmentSchema = (0, drizzle_zod_1.createInsertSchema)(index_1.shipments, {
    shipment_id: zod_1.z
        .string()
        .max(20, { message: "Shipment ID must not exceed 20 characters" })
        .optional(),
    shipment_date: zod_1.z.coerce.date({ message: "Invalid date" }).optional(),
    vehicle_vin: zod_1.z
        .string()
        .max(20, { message: "Vehicle VIN must not exceed 20 characters" })
        .optional(),
    captain_id: zod_1.z.string().uuid({ message: "Invalid captain ID" }).optional(),
    status: zod_1.z.enum(enum_1.shipmentStatusEnum).optional(),
});
