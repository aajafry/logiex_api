import {
  foreignKey,
  index,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { customers, inventories } from "../index.js";
import { salesStatusEnum } from "../../utils/enum.js";

export const salesStatus = pgEnum("logiex_order_status", salesStatusEnum);

export const sales = pgTable(
  "logiex_sales",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bill_id: varchar("bill_id", { length: 20 }).unique().notNull(),
    inventory: varchar("inventory", { length: 80 }).notNull(),
    customer_id: uuid("customer_id").notNull(),
    shipping_address: text("shipping_address", { length: 255 }).notNull(),
    adjustment: numeric({ precision: 10, scale: 3 }).default(0),
    total_price: numeric("total_price", {
      precision: 10,
      scale: 3,
    }).default(0),
    status: salesStatus("status").default("processing"),
    sale_date: timestamp("sale_date", { mode: "string" }).defaultNow(),
    created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
    updated_at: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      bill_idIdx: index("sales_bill_id_idx").on(table.bill_id),
      customerIdx: index("sales_customer_id_idx").on(table.customer_id),
      saleDateIdx: index("sales_sale_date_idx").on(table.sale_date),
      statusIdx: index("sales_status_idx").on(table.status),
      customerFk: foreignKey({
        columns: [table.customer_id],
        foreignColumns: [customers.id],
        name: "fk_customer",
      })
        .onUpdate("cascade")
        .onDelete("cascade"),
      inventoryFk: foreignKey({
        columns: [table.inventory],
        foreignColumns: [inventories.name],
        name: "fk_inventory",
      })
        .onUpdate("cascade")
        .onDelete("set null"),
    };
  }
);
