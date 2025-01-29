export declare const inventoryProductsRelations: import("drizzle-orm/relations").Relations<"logiex_inventory_products", {
    purchase: import("drizzle-orm/relations").One<"logiex_purchases", true>;
    inventory: import("drizzle-orm/relations").One<"logiex_inventories", true>;
    product: import("drizzle-orm/relations").One<"logiex_products", true>;
}>;
//# sourceMappingURL=relations.d.ts.map