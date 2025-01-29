"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findVehicleByChassisNo = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const connection_1 = require("../database/connection");
const index_1 = require("../schemas/index");
const findVehicleByChassisNo = async (chassisNo) => {
    const [vehicle] = await connection_1.db
        .select()
        .from(index_1.vehicles)
        .where((0, drizzle_orm_1.ilike)(index_1.vehicles.chassis_no, chassisNo))
        .limit(1);
    return vehicle ? vehicle : null;
};
exports.findVehicleByChassisNo = findVehicleByChassisNo;
