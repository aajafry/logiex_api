import { relations } from "drizzle-orm/relations";
import { purchases, vendors } from "../index";


export const vendorsRelations = relations(vendors, ({ many }) => ({
  sales: many(purchases),
}));
