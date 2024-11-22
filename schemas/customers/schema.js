import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const customers = pgTable(
  "logiex_customers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 80 }).notNull(),
    email: varchar("email", { length: 150 }).unique(),
    phone: varchar("phone", { length: 16 }).unique(),
    address: text("address", { length: 255 }),
    created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
  },
  (table) => {
    return {
      nameIdx: index("customers_name_idx").on(table.name),
    };
  }
);
