"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transfers = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const index_1 = require("../index");
exports.transfers = (0, pg_core_1.pgTable)("logiex_transfers", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    trf_id: (0, pg_core_1.varchar)("trf_id", { length: 20 }).unique().notNull(),
    source_inventory: (0, pg_core_1.varchar)("source_inventory", { length: 80 }).notNull(),
    destination_inventory: (0, pg_core_1.varchar)("destination_inventory", {
        length: 80,
    }).notNull(),
    transfer_date: (0, pg_core_1.timestamp)("transfer_date", { mode: "string" }).defaultNow(),
    created_at: (0, pg_core_1.timestamp)("created_at", { mode: "string" }).defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at", { mode: "string" }),
}, (table) => {
    return {
        trfIdIdx: (0, pg_core_1.index)("transfers_trf_id_idx").on(table.trf_id),
        sourceInventoryIdx: (0, pg_core_1.index)("transfers_source_inventory_idx").on(table.source_inventory),
        destinationInventoryIdx: (0, pg_core_1.index)("transfers_destination_inventory_idx").on(table.destination_inventory),
        transferDateIdx: (0, pg_core_1.index)("transfers_transfer_date_idx").on(table.transfer_date),
        sourceInventoryFk: (0, pg_core_1.foreignKey)({
            columns: [table.source_inventory],
            foreignColumns: [index_1.inventories.name],
            name: "fk_source_inventory",
        })
            .onUpdate("cascade")
            .onDelete("set null"),
        destinationInventoryFk: (0, pg_core_1.foreignKey)({
            columns: [table.destination_inventory],
            foreignColumns: [index_1.inventories.name],
            name: "fk_destination_inventory",
        })
            .onUpdate("cascade")
            .onDelete("set null"),
    };
});
