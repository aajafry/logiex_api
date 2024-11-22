import {
  foreignKey,
  index,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { categories } from "../index.js";

export const products = pgTable(
  "logiex_products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 80 }).unique().notNull(),
    description: text("description", { length: 750 }),
    price: numeric({ precision: 10, scale: 3 }).notNull(),
    category: varchar("category", { length: 20 }).notNull(),
    sku: varchar("sku", { length: 80 }).unique().notNull(),
    created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
    updated_at: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      nameIdx: index("products_name_idx").on(table.name),
      categoryIdx: index("products_category_idx").on(table.category),
      skuIdx: index("products_sku_idx").on(table.sku),
      categoryFk: foreignKey({
        columns: [table.category],
        foreignColumns: [categories.name],
        name: "fk_category",
      })
        .onUpdate("cascade")
        .onDelete("set null"),
    };
  }
);
