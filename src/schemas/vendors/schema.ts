import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const vendors = pgTable(
  "logiex_vendors",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 80 }).unique().notNull(),
    email: varchar("email", { length: 150 }).unique(),
    phone: varchar("phone", { length: 16 }).unique(),
    address: text("address"),
    created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
    updated_at: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      nameIdx: index("vendors_name_idx").on(table.name),
      emailIdx: index("vendors_email_idx").on(table.email),
      phoneIdx: index("vendors_phone_idx").on(table.phone),
    };
  }
);
