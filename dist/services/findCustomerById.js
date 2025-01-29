"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCustomerById = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const connection_1 = require("../database/connection");
const index_1 = require("../schemas/index");
const findCustomerById = async (customerId) => {
    const [customer] = await connection_1.db
        .select()
        .from(index_1.customers)
        .where((0, drizzle_orm_1.eq)(index_1.customers.id, customerId))
        .limit(1);
    return customer ? customer : null;
};
exports.findCustomerById = findCustomerById;
