"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserWithRole = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const connection_1 = require("../database/connection");
const index_1 = require("../schemas/index");
const findUserWithRole = async (email, allowedRoles) => {
    const [user] = await connection_1.db
        .select()
        .from(index_1.users)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(index_1.users.email, email), (0, drizzle_orm_1.inArray)(index_1.users.role, allowedRoles)))
        .limit(1);
    return user ? user : null;
};
exports.findUserWithRole = findUserWithRole;
