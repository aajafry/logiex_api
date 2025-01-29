"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findInventoryByEmail = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const connection_1 = require("../database/connection");
const index_1 = require("../schemas/index");
const findInventoryByEmail = async (email) => {
    const [inventory] = await connection_1.db
        .select()
        .from(index_1.inventories)
        .where((0, drizzle_orm_1.ilike)(index_1.inventories.email, email))
        .limit(1);
    return inventory ? inventory : null;
};
exports.findInventoryByEmail = findInventoryByEmail;
