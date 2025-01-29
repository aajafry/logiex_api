import { z } from "zod";
export declare const insertShipmentSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    created_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    status: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodEnum<[string, ...string[]]>>>>;
    shipment_id: z.ZodString;
    vehicle_vin: z.ZodString;
    captain_id: z.ZodString;
    shipment_date: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodDate>>>;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    shipment_id: string;
    vehicle_vin: string;
    captain_id: string;
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    status?: string | null | undefined;
    shipment_date?: Date | null | undefined;
}, {
    shipment_id: string;
    vehicle_vin: string;
    captain_id: string;
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    status?: string | null | undefined;
    shipment_date?: Date | null | undefined;
}>;
export declare const updateShipmentSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    created_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    status: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodEnum<[string, ...string[]]>>>>;
    shipment_id: z.ZodOptional<z.ZodString>;
    vehicle_vin: z.ZodOptional<z.ZodString>;
    captain_id: z.ZodOptional<z.ZodString>;
    shipment_date: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodDate>>>;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    status?: string | null | undefined;
    shipment_id?: string | undefined;
    vehicle_vin?: string | undefined;
    captain_id?: string | undefined;
    shipment_date?: Date | null | undefined;
}, {
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    status?: string | null | undefined;
    shipment_id?: string | undefined;
    vehicle_vin?: string | undefined;
    captain_id?: string | undefined;
    shipment_date?: Date | null | undefined;
}>;
//# sourceMappingURL=validations.d.ts.map