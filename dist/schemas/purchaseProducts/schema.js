"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseProducts = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const index_1 = require("../index");
exports.purchaseProducts = (0, pg_core_1.pgTable)("logiex_purchase_products", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    mr_id: (0, pg_core_1.varchar)("mr_id", { length: 20 }).notNull(),
    product: (0, pg_core_1.varchar)("product", { length: 80 }).notNull(),
    quantity: (0, pg_core_1.integer)("quantity").notNull(),
    unit_price: (0, pg_core_1.numeric)({ precision: 10, scale: 3 }).notNull(),
    discount: (0, pg_core_1.numeric)({ precision: 10, scale: 3 }).default("0"),
    total_price: (0, pg_core_1.numeric)({ precision: 10, scale: 3 }).notNull(),
    created_at: (0, pg_core_1.timestamp)("created_at", { mode: "string" }).defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at", { mode: "string" }),
}, (table) => {
    return {
        mr_idIdx: (0, pg_core_1.index)("purchase_products_mr_id_idx").on(table.mr_id),
        productIdx: (0, pg_core_1.index)("purchase_products_product_idx").on(table.product),
        mr_idFk: (0, pg_core_1.foreignKey)({
            columns: [table.mr_id],
            foreignColumns: [index_1.purchases.mr_id],
            name: "fk_mr_id",
        })
            .onUpdate("cascade")
            .onDelete("cascade"),
        productFk: (0, pg_core_1.foreignKey)({
            columns: [table.product],
            foreignColumns: [index_1.products.name],
            name: "fk_product",
        })
            .onUpdate("cascade")
            .onDelete("set null"),
    };
});
