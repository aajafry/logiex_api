import { relations } from "drizzle-orm/relations";
import {
  inventories,
  transfers,
  transferProducts,
} from "../index.js";

export const transfersRelations = relations(transfers, ({ one, many }) => ({
  source: one(inventories, {
    fields: [transfers.source_inventory],
    references: [inventories.name],
    relationName: "source",
  }),
  destination: one(inventories, {
    fields: [transfers.destination_inventory],
    references: [inventories.name],
    relationName: "destination",
  }),
  products: many(transferProducts),
}));
