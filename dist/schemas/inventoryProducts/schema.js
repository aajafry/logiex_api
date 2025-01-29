"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryProducts = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const index_1 = require("../index");
exports.inventoryProducts = (0, pg_core_1.pgTable)("logiex_inventory_products", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    mr_id: (0, pg_core_1.varchar)("mr_id", { length: 20 }).notNull(),
    inventory: (0, pg_core_1.varchar)("inventory", { length: 80 }).notNull(),
    product: (0, pg_core_1.varchar)("product", { length: 80 }).notNull(),
    quantity: (0, pg_core_1.integer)("quantity").notNull().default(0),
    created_at: (0, pg_core_1.timestamp)("created_at", { mode: "string" }).defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at", { mode: "string" }),
}, (table) => {
    return {
        inventoryIdx: (0, pg_core_1.index)("inventory_products_inventory_idx").on(table.inventory),
        productIdx: (0, pg_core_1.index)("inventory_products_product_idx").on(table.product),
        mr_idIdx: (0, pg_core_1.index)("inventory_products_mr_id_idx").on(table.mr_id),
        mr_idFk: (0, pg_core_1.foreignKey)({
            columns: [table.mr_id],
            foreignColumns: [index_1.purchases.mr_id],
            name: "fk_mr_id",
        })
            .onUpdate("cascade")
            .onDelete("set null"),
        inventoryFk: (0, pg_core_1.foreignKey)({
            columns: [table.inventory],
            foreignColumns: [index_1.inventories.name],
            name: "fk_inventory",
        })
            .onUpdate("cascade")
            .onDelete("cascade"),
        productFk: (0, pg_core_1.foreignKey)({
            columns: [table.product],
            foreignColumns: [index_1.products.name],
            name: "fk_product",
        })
            .onUpdate("cascade")
            .onDelete("cascade"),
    };
});
