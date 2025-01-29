import { relations } from "drizzle-orm/relations";
import { sales, shipments, shipmentProducts } from "../index";

export const shipmentProductsRelations = relations(
  shipmentProducts,
  ({ one }) => ({
    shipment: one(shipments, {
      fields: [shipmentProducts.shipment_id],
      references: [shipments.shipment_id],
    }),
    sale: one(sales, {
      fields: [shipmentProducts.bill_id],
      references: [sales.bill_id],
    }),
  })
);
