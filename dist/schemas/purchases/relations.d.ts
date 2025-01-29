export declare const purchasesRelations: import("drizzle-orm/relations").Relations<"logiex_purchases", {
    vendor: import("drizzle-orm/relations").One<"logiex_vendors", true>;
    inventory: import("drizzle-orm/relations").One<"logiex_inventories", true>;
    products: import("drizzle-orm/relations").Many<"logiex_purchase_products">;
    storages: import("drizzle-orm/relations").Many<"logiex_inventory_products">;
    sales: import("drizzle-orm/relations").Many<"logiex_sale_products">;
}>;
//# sourceMappingURL=relations.d.ts.map