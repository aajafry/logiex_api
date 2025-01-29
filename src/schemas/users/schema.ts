import {
  boolean,
  foreignKey,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { userRolesEnum } from "../../utils/enum";

export const userRoles = pgEnum("logiex_user_role", userRolesEnum);

export const users = pgTable(
  "logiex_users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 80 }).notNull(),
    email: varchar("email", { length: 150 }).unique().notNull(),
    phone: varchar("phone", { length: 16 }).unique(),
    avatar: varchar("avatar", { length: 255 }),
    address: text("address"),
    password: varchar("password").notNull(),
    role: userRoles("role").default("admin"),
    national_id: varchar("national_id", { length: 20 }),
    driving_license_no: varchar("driving_license_no", { length: 20 }),
    passport_no: varchar("passport_no", { length: 20 }),
    isOnline: boolean().notNull().default(false),
    last_login_at: timestamp("last_login_at", { mode: "string" }),
    login_count: integer("login_count").default(0),
    failed_login_attempt_count: integer("failed_login_attempt_count").default(
      0
    ),
    failed_login_attempt_last_at: timestamp("failed_login_attempt_last_at", {
      mode: "string",
    }),
    validation_token: varchar("validation_token"),
    validation_token_expired_at: timestamp("validation_token_expired_at"),
    reset_password_token: varchar("reset_password_token"),
    reset_password_token_expired_at: timestamp(
      "reset_password_token_expired_at"
    ),
    created_by: uuid("created_by"),
    created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
    updated_at: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      emailIdx: index("users_email_idx").on(table.email),
      phoneIdx: index("users_phone_idx").on(table.phone),
      roleIdx: index("users_role_idx").on(table.role),
      creatorFk: foreignKey({
        columns: [table.created_by],
        foreignColumns: [table.id],
        name: "fk_creator",
      })
        .onUpdate("cascade")
        .onDelete("set null"),
    };
  }
);
