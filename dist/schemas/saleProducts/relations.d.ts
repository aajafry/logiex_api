export declare const saleProductsRelations: import("drizzle-orm/relations").Relations<"logiex_sale_products", {
    sale: import("drizzle-orm/relations").One<"logiex_sales", true>;
    product: import("drizzle-orm/relations").One<"logiex_products", true>;
    purchase: import("drizzle-orm/relations").One<"logiex_purchases", true>;
    inventory: import("drizzle-orm/relations").One<"logiex_inventories", true>;
}>;
//# sourceMappingURL=relations.d.ts.map