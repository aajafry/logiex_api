"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shipments = exports.shipmentStatus = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const enum_1 = require("../../utils/enum");
const index_1 = require("../index");
exports.shipmentStatus = (0, pg_core_1.pgEnum)("logiex_shipment_status", enum_1.shipmentStatusEnum);
exports.shipments = (0, pg_core_1.pgTable)("logiex_shipments", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    shipment_id: (0, pg_core_1.varchar)("shipment_id", { length: 20 }).unique().notNull(),
    vehicle_vin: (0, pg_core_1.varchar)("vehicle_vin", { length: 20 }).notNull(),
    captain_id: (0, pg_core_1.uuid)("captain_id").notNull(),
    shipment_date: (0, pg_core_1.timestamp)("shipment_date", { mode: "string" }).defaultNow(),
    status: (0, exports.shipmentStatus)("status").default("pending"),
    created_at: (0, pg_core_1.timestamp)("created_at", { mode: "string" }).defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at", { mode: "string" }),
}, (table) => {
    return {
        shipment_idIdx: (0, pg_core_1.index)("shipments_shipment_id_idx").on(table.shipment_id),
        vehicle_vinIdx: (0, pg_core_1.index)("shipments_vehicle_vin_idx").on(table.vehicle_vin),
        captain_idIdx: (0, pg_core_1.index)("shipments_captain_id_idx").on(table.captain_id),
        shipmentDateIdx: (0, pg_core_1.index)("shipments_shipment_date_idx").on(table.shipment_date),
        vehicleFk: (0, pg_core_1.foreignKey)({
            columns: [table.vehicle_vin],
            foreignColumns: [index_1.vehicles.vin],
            name: "fk_vehicle",
        })
            .onUpdate("cascade")
            .onDelete("cascade"),
        captainFk: (0, pg_core_1.foreignKey)({
            columns: [table.captain_id],
            foreignColumns: [index_1.users.id],
            name: "fk_captain",
        })
            .onUpdate("cascade")
            .onDelete("cascade"),
    };
});
