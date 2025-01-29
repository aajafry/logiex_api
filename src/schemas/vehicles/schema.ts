import {
  index,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { vehicleTypesEnum } from "../../utils/enum";

export const vehicleTypes = pgEnum("logiex_vehicle_type", vehicleTypesEnum);

export const vehicles = pgTable(
  "logiex_vehicles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    make: varchar("make", { length: 80 }).notNull(),
    model: varchar("model", { length: 80 }),
    year: integer().notNull(),
    color: varchar("color", { length: 20 }).notNull(),
    mileage: integer(),
    engine_no: varchar("engine_no", { length: 20 }).unique(),
    chassis_no: varchar("chassis_no", { length: 20 }).unique(),
    vin: varchar("vin", { length: 20 }).unique().notNull(),
    plate_number: varchar("plate_number", { length: 20 }).unique().notNull(),
    cargo_capacity: integer().notNull(),
    type: vehicleTypes("type").notNull(),
    created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
    updated_at: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      makeModelYearIdx: index("vehicles_make_model_year_idx").on(
        table.make,
        table.model,
        table.year
      ),
      engineNoIdx: index("vehicles_engine_no_idx").on(table.engine_no),
      chassisNoIdx: index("vehicles_chassis_no_idx").on(table.chassis_no),
      typeIdx: index("vehicles_type_idx").on(table.type),
      vinIdx: index("vehicles_vin_idx").on(table.vin),
      plate_numberIdx: index("vehicles_plate_number_idx").on(
        table.plate_number
      ),
    };
  }
);
