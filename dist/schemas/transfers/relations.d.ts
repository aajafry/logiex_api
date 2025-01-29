export declare const transfersRelations: import("drizzle-orm/relations").Relations<"logiex_transfers", {
    source: import("drizzle-orm/relations").One<"logiex_inventories", true>;
    destination: import("drizzle-orm/relations").One<"logiex_inventories", true>;
    products: import("drizzle-orm/relations").Many<"logiex_transfer_products">;
}>;
//# sourceMappingURL=relations.d.ts.map