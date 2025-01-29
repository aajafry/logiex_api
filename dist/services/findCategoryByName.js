"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCategoryByName = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const connection_1 = require("../database/connection");
const index_1 = require("../schemas/index");
const findCategoryByName = async (name) => {
    const [category] = await connection_1.db
        .select()
        .from(index_1.categories)
        .where((0, drizzle_orm_1.ilike)(index_1.categories.name, name))
        .limit(1);
    return category ? category : null;
};
exports.findCategoryByName = findCategoryByName;
