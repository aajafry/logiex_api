import {
  foreignKey,
  index,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { inventories, products, purchases } from "../index.js"


export const inventoryProducts = pgTable(
  "logiex_inventory_products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    mr_id: varchar("mr_id", { length: 20 }).notNull(),
    inventory: varchar("inventory", { length: 80 }).notNull(),
    product: varchar("product", { length: 80 }).notNull(),
    quantity: integer("quantity").notNull().default(0),
    created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
    updated_at: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      inventoryIdx: index("inventory_products_inventory_idx").on(
        table.inventory
      ),
      productIdx: index("inventory_products_product_idx").on(table.product),
      mr_idIdx: index("inventory_products_mr_id_idx").on(table.mr_id),
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
        .onDelete("cascade"),
      productFk: foreignKey({
        columns: [table.product],
        foreignColumns: [products.name],
        name: "fk_product",
      })
        .onUpdate("cascade")
        .onDelete("cascade"),
    };
  }
);
