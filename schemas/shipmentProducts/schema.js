import {
  foreignKey,
  index,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { sales, shipments } from "../index.js";

export const shipmentProducts = pgTable(
  "logiex_shipment_products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    shipment_id: varchar("shipment_id", { length: 20 }).notNull(),
    bill_id: varchar("bill_id", { length: 20 }).notNull(),
    created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
    updated_at: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      shipment_idIdx: index("shipment_products_shipment_id_idx").on(
        table.shipment_id
      ),
      bill_idIdx: index("shipment_products_bill_id_idx").on(table.bill_id),
      shipment_idFk: foreignKey({
        columns: [table.shipment_id],
        foreignColumns: [shipments.shipment_id],
        name: "fk_shipment_id",
      })
        .onUpdate("cascade")
        .onDelete("cascade"),
      bill_idFk: foreignKey({
        columns: [table.bill_id],
        foreignColumns: [sales.bill_id],
        name: "fk_bill_id",
      })
        .onUpdate("cascade")
        .onDelete("cascade"),
    };
  }
);
