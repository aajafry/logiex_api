"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByPhone = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const connection_1 = require("../database/connection");
const index_1 = require("../schemas/index");
const findUserByPhone = async (phone) => {
    const [user] = await connection_1.db
        .select()
        .from(index_1.users)
        .where((0, drizzle_orm_1.ilike)(index_1.users.phone, phone))
        .limit(1);
    return user ? user : null;
};
exports.findUserByPhone = findUserByPhone;
