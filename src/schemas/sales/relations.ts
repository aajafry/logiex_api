import { relations } from "drizzle-orm/relations";
import {
  sales,
  shipmentProducts,
  saleProducts,
  customers,
  inventories,
} from "../index";

export const salesRelations = relations(sales, ({ one, many }) => ({
  customer: one(customers, {
    fields: [sales.customer_id],
    references: [customers.id],
  }),
  inventory: one(inventories, {
    fields: [sales.inventory],
    references: [inventories.name],
  }),
  products: many(saleProducts),
  shipments: many(shipmentProducts),
}));
