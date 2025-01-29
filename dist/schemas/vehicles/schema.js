"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicles = exports.vehicleTypes = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const enum_1 = require("../../utils/enum");
exports.vehicleTypes = (0, pg_core_1.pgEnum)("logiex_vehicle_type", enum_1.vehicleTypesEnum);
exports.vehicles = (0, pg_core_1.pgTable)("logiex_vehicles", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    make: (0, pg_core_1.varchar)("make", { length: 80 }).notNull(),
    model: (0, pg_core_1.varchar)("model", { length: 80 }),
    year: (0, pg_core_1.integer)().notNull(),
    color: (0, pg_core_1.varchar)("color", { length: 20 }).notNull(),
    mileage: (0, pg_core_1.integer)(),
    engine_no: (0, pg_core_1.varchar)("engine_no", { length: 20 }).unique(),
    chassis_no: (0, pg_core_1.varchar)("chassis_no", { length: 20 }).unique(),
    vin: (0, pg_core_1.varchar)("vin", { length: 20 }).unique().notNull(),
    plate_number: (0, pg_core_1.varchar)("plate_number", { length: 20 }).unique().notNull(),
    cargo_capacity: (0, pg_core_1.integer)().notNull(),
    type: (0, exports.vehicleTypes)("type").notNull(),
    created_at: (0, pg_core_1.timestamp)("created_at", { mode: "string" }).defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at", { mode: "string" }),
}, (table) => {
    return {
        makeModelYearIdx: (0, pg_core_1.index)("vehicles_make_model_year_idx").on(table.make, table.model, table.year),
        engineNoIdx: (0, pg_core_1.index)("vehicles_engine_no_idx").on(table.engine_no),
        chassisNoIdx: (0, pg_core_1.index)("vehicles_chassis_no_idx").on(table.chassis_no),
        typeIdx: (0, pg_core_1.index)("vehicles_type_idx").on(table.type),
        vinIdx: (0, pg_core_1.index)("vehicles_vin_idx").on(table.vin),
        plate_numberIdx: (0, pg_core_1.index)("vehicles_plate_number_idx").on(table.plate_number),
    };
});
