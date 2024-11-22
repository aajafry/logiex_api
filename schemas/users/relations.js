import { relations } from "drizzle-orm/relations";
import { users, shipments, inventoryEmployments } from "../index.js";

export const userRelations = relations(users, ({ one, many }) => ({
  creator: one(users, {
    fields: [users.created_by],
    references: [users.id],
  }),
  inventoryInCharges: many(inventoryEmployments),
  captains: many(shipments),
}));
