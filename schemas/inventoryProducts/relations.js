import { relations } from "drizzle-orm/relations";
import {
  purchases,
  inventories,
  products,
  inventoryProducts,
} from "../index.js";

export const inventoryProductsRelations = relations(
  inventoryProducts,
  ({ one }) => ({
    purchase: one(purchases, {
      fields: [inventoryProducts.mr_id],
      references: [purchases.mr_id],
    }),
    inventory: one(inventories, {
      fields: [inventoryProducts.inventory],
      references: [inventories.name],
    }),
    product: one(products, {
      fields: [inventoryProducts.product],
      references: [products.name],
    }),
  })
);
