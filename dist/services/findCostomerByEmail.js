"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCustomerByEmail = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const connection_1 = require("../database/connection");
const index_1 = require("../schemas/index");
const findCustomerByEmail = async (email) => {
    const [customer] = await connection_1.db
        .select()
        .from(index_1.customers)
        .where((0, drizzle_orm_1.ilike)(index_1.customers.email, email))
        .limit(1);
    return customer ? customer : null;
};
exports.findCustomerByEmail = findCustomerByEmail;
