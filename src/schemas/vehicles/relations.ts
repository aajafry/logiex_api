import { relations } from "drizzle-orm/relations";
import { vehicles, shipments } from "../index";

export const vehiclesRelations = relations(vehicles, ({ many }) => ({
  shipments: many(shipments),
}));
