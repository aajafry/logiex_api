"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByIdAndRole = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const connection_1 = require("../database/connection");
const index_1 = require("../schemas/index");
const findUserByIdAndRole = async (id, role) => {
    const [user] = await connection_1.db
        .select()
        .from(index_1.users)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(index_1.users.id, id), (0, drizzle_orm_1.eq)(index_1.users.role, role)))
        .limit(1);
    return user ? user : null;
};
exports.findUserByIdAndRole = findUserByIdAndRole;
