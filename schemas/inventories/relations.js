import { relations } from "drizzle-orm/relations";
import {
  inventories,
  inventoryEmployments,
  inventoryProducts,
  transfers,
  purchases,
  saleProducts,
  sales,
} from "../index.js";

export const inventoriesRelations = relations(inventories, ({ many }) => ({
  inventories: many(inventoryProducts),
  purchases: many(purchases),
  sales: many(sales),
  saleProducts: many(saleProducts),
  employees: many(inventoryEmployments),
  source: many(transfers, {
    relationName: "source",
  }),
  destination: many(transfers, {
    relationName: "destination",
  }),
}));
