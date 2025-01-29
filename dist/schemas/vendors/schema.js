"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendors = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.vendors = (0, pg_core_1.pgTable)("logiex_vendors", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    name: (0, pg_core_1.varchar)("name", { length: 80 }).unique().notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 150 }).unique(),
    phone: (0, pg_core_1.varchar)("phone", { length: 16 }).unique(),
    address: (0, pg_core_1.text)("address"),
    created_at: (0, pg_core_1.timestamp)("created_at", { mode: "string" }).defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at", { mode: "string" }),
}, (table) => {
    return {
        nameIdx: (0, pg_core_1.index)("vendors_name_idx").on(table.name),
        emailIdx: (0, pg_core_1.index)("vendors_email_idx").on(table.email),
        phoneIdx: (0, pg_core_1.index)("vendors_phone_idx").on(table.phone),
    };
});
