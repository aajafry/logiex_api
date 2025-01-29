"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findVehicleByPlateNumber = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const connection_1 = require("../database/connection");
const index_1 = require("../schemas/index");
const findVehicleByPlateNumber = async (plateNumber) => {
    const [vehicle] = await connection_1.db
        .select()
        .from(index_1.vehicles)
        .where((0, drizzle_orm_1.ilike)(index_1.vehicles.plate_number, plateNumber))
        .limit(1);
    return vehicle ? vehicle : null;
};
exports.findVehicleByPlateNumber = findVehicleByPlateNumber;
