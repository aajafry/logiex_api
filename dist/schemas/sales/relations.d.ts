export declare const salesRelations: import("drizzle-orm/relations").Relations<"logiex_sales", {
    customer: import("drizzle-orm/relations").One<"logiex_customers", true>;
    inventory: import("drizzle-orm/relations").One<"logiex_inventories", true>;
    products: import("drizzle-orm/relations").Many<"logiex_sale_products">;
    shipments: import("drizzle-orm/relations").Many<"logiex_shipment_products">;
}>;
//# sourceMappingURL=relations.d.ts.map