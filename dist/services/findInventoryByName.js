"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findInventoryByName = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const connection_1 = require("../database/connection");
const index_1 = require("../schemas/index");
const findInventoryByName = async (name) => {
    const [inventory] = await connection_1.db
        .select()
        .from(index_1.inventories)
        .where((0, drizzle_orm_1.ilike)(index_1.inventories.name, name))
        .limit(1);
    return inventory ? inventory : null;
};
exports.findInventoryByName = findInventoryByName;
