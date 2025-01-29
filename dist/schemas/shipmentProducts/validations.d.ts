import { z } from "zod";
export declare const insertShipmentProductSchema: z.ZodObject<Omit<{
    id: z.ZodOptional<z.ZodString>;
    created_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    bill_id: z.ZodString;
    shipment_id: z.ZodString;
}, "shipment_id">, z.UnknownKeysParam, z.ZodTypeAny, {
    bill_id: string;
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
}, {
    bill_id: string;
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
}>;
export declare const updateShipmentProductSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    created_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    bill_id: z.ZodOptional<z.ZodString>;
    shipment_id: z.ZodOptional<z.ZodString>;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    bill_id?: string | undefined;
    shipment_id?: string | undefined;
}, {
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    bill_id?: string | undefined;
    shipment_id?: string | undefined;
}>;
//# sourceMappingURL=validations.d.ts.map