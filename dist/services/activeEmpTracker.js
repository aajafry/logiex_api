"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activeEmpTracker = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const connection_1 = require("../database/connection");
const index_1 = require("../schemas/index");
const activeEmpTracker = async (inventory) => {
    const [activeEmployee] = await connection_1.db
        .select()
        .from(index_1.inventoryEmployments)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.ilike)(index_1.inventoryEmployments.inventory, inventory), (0, drizzle_orm_1.eq)(index_1.inventoryEmployments.employee_status, true)))
        .limit(1);
    return activeEmployee ? activeEmployee : null;
};
exports.activeEmpTracker = activeEmpTracker;
