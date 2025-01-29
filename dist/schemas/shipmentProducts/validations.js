"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateShipmentProductSchema = exports.insertShipmentProductSchema = void 0;
const zod_1 = require("zod");
const drizzle_zod_1 = require("drizzle-zod");
const index_1 = require("../index");
exports.insertShipmentProductSchema = (0, drizzle_zod_1.createInsertSchema)(index_1.shipmentProducts, {
    bill_id: zod_1.z
        .string({
        required_error: "BILL ID is required",
    })
        .max(20, { message: "BILL ID must not exceed 20 characters" })
        .nonempty({ message: "BILL ID is required" }),
}).omit({ shipment_id: true });
exports.updateShipmentProductSchema = (0, drizzle_zod_1.createInsertSchema)(index_1.shipmentProducts, {
    shipment_id: zod_1.z
        .string()
        .max(20, { message: "Shipment ID must not exceed 20 characters" })
        .optional(),
    bill_id: zod_1.z
        .string()
        .max(20, { message: "BILL ID must not exceed 20 characters" })
        .optional(),
});
