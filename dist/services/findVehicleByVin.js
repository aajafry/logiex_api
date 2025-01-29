"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findVehicleByVin = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const connection_1 = require("../database/connection");
const index_1 = require("../schemas/index");
const findVehicleByVin = async (vin) => {
    const [vehicle] = await connection_1.db
        .select()
        .from(index_1.vehicles)
        .where((0, drizzle_orm_1.ilike)(index_1.vehicles.vin, vin))
        .limit(1);
    return vehicle ? vehicle : null;
};
exports.findVehicleByVin = findVehicleByVin;
