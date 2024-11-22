import {
  index,
  numeric,
  pgTable,
  timestamp,
  uuid,
  varchar,
  foreignKey,
} from "drizzle-orm/pg-core";
import { vendors, inventories } from "../index.js";

export const purchases = pgTable(
  "logiex_purchases",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    vendor: varchar("vendor", { length: 80 }).notNull(),
    inventory: varchar("inventory", { length: 80 }).notNull(),
    mr_id: varchar("mr_id", { length: 20 }).unique().notNull(),
    adjustment: numeric({ precision: 10, scale: 3 }).default(0),
    total_price: numeric({ precision: 10, scale: 3 }).default(0),
    purchase_date: timestamp("purchase_date", { mode: "string" }).defaultNow(),
    created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
    updated_at: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      mr_idIdx: index("purchases_mr_id_idx").on(table.mr_id),
      purchaseDateIdx: index("purchases_purchase_date_idx").on(
        table.purchase_date
      ),
      vendorFk: foreignKey({
        columns: [table.vendor],
        foreignColumns: [vendors.name],
        name: "fk_vendor",
      })
        .onUpdate("cascade")
        .onDelete("set null"),
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
