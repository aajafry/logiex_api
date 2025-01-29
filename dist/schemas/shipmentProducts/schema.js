"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shipmentProducts = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const index_1 = require("../index");
exports.shipmentProducts = (0, pg_core_1.pgTable)("logiex_shipment_products", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    shipment_id: (0, pg_core_1.varchar)("shipment_id", { length: 20 }).notNull(),
    bill_id: (0, pg_core_1.varchar)("bill_id", { length: 20 }).notNull(),
    created_at: (0, pg_core_1.timestamp)("created_at", { mode: "string" }).defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at", { mode: "string" }),
}, (table) => {
    return {
        shipment_idIdx: (0, pg_core_1.index)("shipment_products_shipment_id_idx").on(table.shipment_id),
        bill_idIdx: (0, pg_core_1.index)("shipment_products_bill_id_idx").on(table.bill_id),
        shipment_idFk: (0, pg_core_1.foreignKey)({
            columns: [table.shipment_id],
            foreignColumns: [index_1.shipments.shipment_id],
            name: "fk_shipment_id",
        })
            .onUpdate("cascade")
            .onDelete("cascade"),
        bill_idFk: (0, pg_core_1.foreignKey)({
            columns: [table.bill_id],
            foreignColumns: [index_1.sales.bill_id],
            name: "fk_bill_id",
        })
            .onUpdate("cascade")
            .onDelete("cascade"),
    };
});
