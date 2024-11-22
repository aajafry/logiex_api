import { relations } from "drizzle-orm/relations";
import { shipmentProducts, users, vehicles, shipments } from "../index.js";

export const shipmentsRelations = relations(shipments, ({ one, many }) => ({
  vehicle: one(vehicles, {
    fields: [shipments.vehicle_vin],
    references: [vehicles.vin],
  }),
  captain: one(users, {
    fields: [shipments.captain_id],
    references: [users.id],
  }),
  items: many(shipmentProducts),
}));
