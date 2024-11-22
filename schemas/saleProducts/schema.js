import {
  foreignKey,
  index,
  integer,
  numeric,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { sales, purchases, products, inventories } from "../index.js";

export const saleProducts = pgTable(
  "logiex_sale_products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    mr_id: varchar("mr_id", { length: 20 }).notNull(),
    inventory: varchar("inventory", { length: 80 }).notNull(),
    bill_id: varchar("bill_id", { length: 20 }).notNull(),
    product: varchar("product", { length: 80 }).notNull(),
    quantity: integer("quantity").notNull(),
    unit_price: numeric({ precision: 10, scale: 3 }).notNull(),
    discount: numeric({ precision: 10, scale: 3 }).default(0),
    total_price: numeric({ precision: 10, scale: 3 }).notNull(),
    created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
    updated_at: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      billIdIdx: index("sale_products_bill_id_idx").on(table.bill_id),
      productIdx: index("sale_products_product_idx").on(table.product),
      mr_idIdx: index("sale_products_mr_id_idx").on(table.mr_id),
      inventoryIdx: index("sale_products_inventory_idx").on(table.inventory),
      bill_idFk: foreignKey({
        columns: [table.bill_id],
        foreignColumns: [sales.bill_id],
        name: "fk_bill_id",
      })
        .onUpdate("cascade")
        .onDelete("cascade"),
      productFk: foreignKey({
        columns: [table.product],
        foreignColumns: [products.name],
        name: "fk_product",
      })
        .onUpdate("cascade")
        .onDelete("set null"),
      mr_idFk: foreignKey({
        columns: [table.mr_id],
        foreignColumns: [purchases.mr_id],
        name: "fk_mr_id",
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
