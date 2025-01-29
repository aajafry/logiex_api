export declare const shipmentsRelations: import("drizzle-orm/relations").Relations<"logiex_shipments", {
    vehicle: import("drizzle-orm/relations").One<"logiex_vehicles", true>;
    captain: import("drizzle-orm/relations").One<"logiex_users", true>;
    items: import("drizzle-orm/relations").Many<"logiex_shipment_products">;
}>;
//# sourceMappingURL=relations.d.ts.map