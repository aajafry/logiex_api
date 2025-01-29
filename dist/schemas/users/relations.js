"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRelations = void 0;
const relations_1 = require("drizzle-orm/relations");
const index_1 = require("../index");
exports.userRelations = (0, relations_1.relations)(index_1.users, ({ one, many }) => ({
    creator: one(index_1.users, {
        fields: [index_1.users.created_by],
        references: [index_1.users.id],
    }),
    inventoryInCharges: many(index_1.inventoryEmployments),
    captains: many(index_1.shipments),
}));
