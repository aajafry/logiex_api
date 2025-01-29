"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customersRelations = void 0;
const relations_1 = require("drizzle-orm/relations");
const index_1 = require("../index");
exports.customersRelations = (0, relations_1.relations)(index_1.customers, ({ many }) => ({
    orders: many(index_1.sales),
}));
