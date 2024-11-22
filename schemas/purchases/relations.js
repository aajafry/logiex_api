import { relations } from "drizzle-orm/relations";
import {
  purchaseProducts,
  inventoryProducts,
  saleProducts,
  vendors,
  purchases,
  inventories,
} from "../index.js";

export const purchasesRelations = relations(purchases, ({ one, many }) => ({
  vendor: one(vendors, {
    fields: [purchases.vendor],
    references: [vendors.name],
  }),
  inventory: one(inventories, {
    fields: [purchases.inventory],
    references: [inventories.name],
  }),
  products: many(purchaseProducts),
  storages: many(inventoryProducts),
  sales: many(saleProducts),
}));
