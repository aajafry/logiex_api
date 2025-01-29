export declare const inventoriesRelations: import("drizzle-orm/relations").Relations<"logiex_inventories", {
    inventories: import("drizzle-orm/relations").Many<"logiex_inventory_products">;
    purchases: import("drizzle-orm/relations").Many<"logiex_purchases">;
    sales: import("drizzle-orm/relations").Many<"logiex_sales">;
    saleProducts: import("drizzle-orm/relations").Many<"logiex_sale_products">;
    employees: import("drizzle-orm/relations").Many<"logiex_inventory_employments">;
    source: import("drizzle-orm/relations").Many<"logiex_transfers">;
    destination: import("drizzle-orm/relations").Many<"logiex_transfers">;
}>;
//# sourceMappingURL=relations.d.ts.map