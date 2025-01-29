"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sales = exports.salesStatus = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const enum_1 = require("../../utils/enum");
const index_1 = require("../index");
exports.salesStatus = (0, pg_core_1.pgEnum)("logiex_order_status", enum_1.salesStatusEnum);
exports.sales = (0, pg_core_1.pgTable)("logiex_sales", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    bill_id: (0, pg_core_1.varchar)("bill_id", { length: 20 }).unique().notNull(),
    inventory: (0, pg_core_1.varchar)("inventory", { length: 80 }).notNull(),
    customer_id: (0, pg_core_1.uuid)("customer_id").notNull(),
    shipping_address: (0, pg_core_1.text)("shipping_address").notNull(),
    adjustment: (0, pg_core_1.numeric)({ precision: 10, scale: 3 }).default("0"),
    total_price: (0, pg_core_1.numeric)("total_price", {
        precision: 10,
        scale: 3,
    }).default("0"),
    status: (0, exports.salesStatus)("status").default("processing"),
    sale_date: (0, pg_core_1.timestamp)("sale_date", { mode: "string" }).defaultNow(),
    created_at: (0, pg_core_1.timestamp)("created_at", { mode: "string" }).defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at", { mode: "string" }),
}, (table) => {
    return {
        bill_idIdx: (0, pg_core_1.index)("sales_bill_id_idx").on(table.bill_id),
        customerIdx: (0, pg_core_1.index)("sales_customer_id_idx").on(table.customer_id),
        saleDateIdx: (0, pg_core_1.index)("sales_sale_date_idx").on(table.sale_date),
        statusIdx: (0, pg_core_1.index)("sales_status_idx").on(table.status),
        customerFk: (0, pg_core_1.foreignKey)({
            columns: [table.customer_id],
            foreignColumns: [index_1.customers.id],
            name: "fk_customer",
        })
            .onUpdate("cascade")
            .onDelete("cascade"),
        inventoryFk: (0, pg_core_1.foreignKey)({
            columns: [table.inventory],
            foreignColumns: [index_1.inventories.name],
            name: "fk_inventory",
        })
            .onUpdate("cascade")
            .onDelete("set null"),
    };
});
