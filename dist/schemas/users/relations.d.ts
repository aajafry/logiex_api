export declare const userRelations: import("drizzle-orm/relations").Relations<"logiex_users", {
    creator: import("drizzle-orm/relations").One<"logiex_users", false>;
    inventoryInCharges: import("drizzle-orm/relations").Many<"logiex_inventory_employments">;
    captains: import("drizzle-orm/relations").Many<"logiex_shipments">;
}>;
//# sourceMappingURL=relations.d.ts.map