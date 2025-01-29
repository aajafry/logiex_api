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
import { products, purchases } from "../index";

export const purchaseProducts = pgTable(
  "logiex_purchase_products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    mr_id: varchar("mr_id", { length: 20 }).notNull(),
    product: varchar("product", { length: 80 }).notNull(),
    quantity: integer("quantity").notNull(),
    unit_price: numeric({ precision: 10, scale: 3 }).notNull(),
    discount: numeric({ precision: 10, scale: 3 }).default("0"),
    total_price: numeric({ precision: 10, scale: 3 }).notNull(),
    created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
    updated_at: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      mr_idIdx: index("purchase_products_mr_id_idx").on(table.mr_id),
      productIdx: index("purchase_products_product_idx").on(table.product),
      mr_idFk: foreignKey({
        columns: [table.mr_id],
        foreignColumns: [purchases.mr_id],
        name: "fk_mr_id",
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
    };
  }
);
