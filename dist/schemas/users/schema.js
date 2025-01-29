"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = exports.userRoles = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const enum_1 = require("../../utils/enum");
exports.userRoles = (0, pg_core_1.pgEnum)("logiex_user_role", enum_1.userRolesEnum);
exports.users = (0, pg_core_1.pgTable)("logiex_users", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    name: (0, pg_core_1.varchar)("name", { length: 80 }).notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 150 }).unique().notNull(),
    phone: (0, pg_core_1.varchar)("phone", { length: 16 }).unique(),
    avatar: (0, pg_core_1.varchar)("avatar", { length: 255 }),
    address: (0, pg_core_1.text)("address"),
    password: (0, pg_core_1.varchar)("password").notNull(),
    role: (0, exports.userRoles)("role").default("admin"),
    national_id: (0, pg_core_1.varchar)("national_id", { length: 20 }),
    driving_license_no: (0, pg_core_1.varchar)("driving_license_no", { length: 20 }),
    passport_no: (0, pg_core_1.varchar)("passport_no", { length: 20 }),
    isOnline: (0, pg_core_1.boolean)().notNull().default(false),
    last_login_at: (0, pg_core_1.timestamp)("last_login_at", { mode: "string" }),
    login_count: (0, pg_core_1.integer)("login_count").default(0),
    failed_login_attempt_count: (0, pg_core_1.integer)("failed_login_attempt_count").default(0),
    failed_login_attempt_last_at: (0, pg_core_1.timestamp)("failed_login_attempt_last_at", {
        mode: "string",
    }),
    validation_token: (0, pg_core_1.varchar)("validation_token"),
    validation_token_expired_at: (0, pg_core_1.timestamp)("validation_token_expired_at"),
    reset_password_token: (0, pg_core_1.varchar)("reset_password_token"),
    reset_password_token_expired_at: (0, pg_core_1.timestamp)("reset_password_token_expired_at"),
    created_by: (0, pg_core_1.uuid)("created_by"),
    created_at: (0, pg_core_1.timestamp)("created_at", { mode: "string" }).defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at", { mode: "string" }),
}, (table) => {
    return {
        emailIdx: (0, pg_core_1.index)("users_email_idx").on(table.email),
        phoneIdx: (0, pg_core_1.index)("users_phone_idx").on(table.phone),
        roleIdx: (0, pg_core_1.index)("users_role_idx").on(table.role),
        creatorFk: (0, pg_core_1.foreignKey)({
            columns: [table.created_by],
            foreignColumns: [table.id],
            name: "fk_creator",
        })
            .onUpdate("cascade")
            .onDelete("set null"),
    };
});
