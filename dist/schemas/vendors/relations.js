"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorsRelations = void 0;
const relations_1 = require("drizzle-orm/relations");
const index_1 = require("../index");
exports.vendorsRelations = (0, relations_1.relations)(index_1.vendors, ({ many }) => ({
    sales: many(index_1.purchases),
}));
