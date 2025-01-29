"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchases = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const index_1 = require("../index");
exports.purchases = (0, pg_core_1.pgTable)("logiex_purchases", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    vendor: (0, pg_core_1.varchar)("vendor", { length: 80 }).notNull(),
    inventory: (0, pg_core_1.varchar)("inventory", { length: 80 }).notNull(),
    mr_id: (0, pg_core_1.varchar)("mr_id", { length: 20 }).unique().notNull(),
    adjustment: (0, pg_core_1.numeric)({ precision: 10, scale: 3 }).default("0"),
    total_price: (0, pg_core_1.numeric)({ precision: 10, scale: 3 }).default("0"),
    purchase_date: (0, pg_core_1.timestamp)("purchase_date", { mode: "string" }).defaultNow(),
    created_at: (0, pg_core_1.timestamp)("created_at", { mode: "string" }).defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at", { mode: "string" }),
}, (table) => {
    return {
        mr_idIdx: (0, pg_core_1.index)("purchases_mr_id_idx").on(table.mr_id),
        purchaseDateIdx: (0, pg_core_1.index)("purchases_purchase_date_idx").on(table.purchase_date),
        vendorFk: (0, pg_core_1.foreignKey)({
            columns: [table.vendor],
            foreignColumns: [index_1.vendors.name],
            name: "fk_vendor",
        })
            .onUpdate("cascade")
            .onDelete("set null"),
        inventoryFk: (0, pg_core_1.foreignKey)({
            columns: [table.inventory],
            foreignColumns: [index_1.inventories.name],
            name: "fk_inventory",
        })
            .onUpdate("cascade")
            .onDelete("set null"),
    };
});
