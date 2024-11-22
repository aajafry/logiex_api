import {
  foreignKey,
  index,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { products, purchases, transfers } from "../index.js";

export const transferProducts = pgTable(
  "logiex_transfer_products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    trf_id: varchar("trf_id", { length: 20 }).notNull(),
    mr_id: varchar("mr_id", { length: 20 }).notNull(),
    product: varchar("product", { length: 80 }).notNull(),
    quantity: integer("quantity").notNull(),
    created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
    updated_at: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      trfIdIdx: index("transfer_products_trf_id_idx").on(table.trf_id),
      productIdx: index("transfer_products_product_idx").on(table.product),
      mr_idIdx: index("transfer_products_mr_id_idx").on(table.mr_id),
      trf_idFk: foreignKey({
        columns: [table.trf_id],
        foreignColumns: [transfers.trf_id],
        name: "fk_trf_id",
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
    };
  }
);
