import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const inventories = pgTable(
  "logiex_inventories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 80 }).unique().notNull(),
    email: varchar("email", { length: 150 }).unique(),
    phone: varchar("phone", { length: 16 }).unique(),
    description: text("description", { length: 750 }),
    address: text("address", { length: 255 }).notNull(),
    created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
    updated_at: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      nameIdx: index("inventories_name_idx").on(table.name),
    };
  }
);
