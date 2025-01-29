import {
  foreignKey,
  index,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { inventories } from "../index";

export const transfers = pgTable(
  "logiex_transfers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    trf_id: varchar("trf_id", { length: 20 }).unique().notNull(),
    source_inventory: varchar("source_inventory", { length: 80 }).notNull(),
    destination_inventory: varchar("destination_inventory", {
      length: 80,
    }).notNull(),
    transfer_date: timestamp("transfer_date", { mode: "string" }).defaultNow(),
    created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
    updated_at: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      trfIdIdx: index("transfers_trf_id_idx").on(table.trf_id),
      sourceInventoryIdx: index("transfers_source_inventory_idx").on(
        table.source_inventory
      ),
      destinationInventoryIdx: index("transfers_destination_inventory_idx").on(
        table.destination_inventory
      ),
      transferDateIdx: index("transfers_transfer_date_idx").on(
        table.transfer_date
      ),
      sourceInventoryFk: foreignKey({
        columns: [table.source_inventory],
        foreignColumns: [inventories.name],
        name: "fk_source_inventory",
      })
        .onUpdate("cascade")
        .onDelete("set null"),
      destinationInventoryFk: foreignKey({
        columns: [table.destination_inventory],
        foreignColumns: [inventories.name],
        name: "fk_destination_inventory",
      })
        .onUpdate("cascade")
        .onDelete("set null"),
    };
  }
);
