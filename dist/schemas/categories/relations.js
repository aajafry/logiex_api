"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesRelations = void 0;
const relations_1 = require("drizzle-orm/relations");
const index_1 = require("../index");
exports.categoriesRelations = (0, relations_1.relations)(index_1.categories, ({ many }) => ({
    products: many(index_1.products),
}));
