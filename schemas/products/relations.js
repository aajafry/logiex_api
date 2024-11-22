import { relations } from "drizzle-orm";
import {
  products,
  categories,
  inventoryProducts,
  purchaseProducts,
  saleProducts,
  transferProducts,
} from "../index.js";

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.category],
    references: [categories.name],
  }),
  purchases: many(purchaseProducts),
  sales: many(saleProducts),
  inventories: many(inventoryProducts),
  transfers: many(transferProducts),
}));
