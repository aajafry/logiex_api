"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.products = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const index_1 = require("../index");
exports.products = (0, pg_core_1.pgTable)("logiex_products", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    name: (0, pg_core_1.varchar)("name", { length: 80 }).unique().notNull(),
    description: (0, pg_core_1.text)("description"),
    price: (0, pg_core_1.numeric)({ precision: 10, scale: 3 }).notNull(),
    category: (0, pg_core_1.varchar)("category", { length: 20 }).notNull(),
    sku: (0, pg_core_1.varchar)("sku", { length: 80 }).unique().notNull(),
    created_at: (0, pg_core_1.timestamp)("created_at", { mode: "string" }).defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at", { mode: "string" }),
}, (table) => {
    return {
        nameIdx: (0, pg_core_1.index)("products_name_idx").on(table.name),
        categoryIdx: (0, pg_core_1.index)("products_category_idx").on(table.category),
        skuIdx: (0, pg_core_1.index)("products_sku_idx").on(table.sku),
        categoryFk: (0, pg_core_1.foreignKey)({
            columns: [table.category],
            foreignColumns: [index_1.categories.name],
            name: "fk_category",
        })
            .onUpdate("cascade")
            .onDelete("set null"),
    };
});
