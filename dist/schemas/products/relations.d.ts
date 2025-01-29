export declare const productsRelations: import("drizzle-orm").Relations<"logiex_products", {
    category: import("drizzle-orm").One<"logiex_categories", true>;
    purchases: import("drizzle-orm").Many<"logiex_purchase_products">;
    sales: import("drizzle-orm").Many<"logiex_sale_products">;
    inventories: import("drizzle-orm").Many<"logiex_inventory_products">;
    transfers: import("drizzle-orm").Many<"logiex_transfer_products">;
}>;
//# sourceMappingURL=relations.d.ts.map