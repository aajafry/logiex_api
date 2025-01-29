"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findVendorByPhone = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const connection_1 = require("../database/connection");
const index_1 = require("../schemas/index");
const findVendorByPhone = async (phone) => {
    const [vendor] = await connection_1.db
        .select()
        .from(index_1.vendors)
        .where((0, drizzle_orm_1.ilike)(index_1.vendors.phone, phone))
        .limit(1);
    return vendor ? vendor : null;
};
exports.findVendorByPhone = findVendorByPhone;
