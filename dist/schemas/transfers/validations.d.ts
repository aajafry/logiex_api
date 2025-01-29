import { z } from "zod";
export declare const insertTransferSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    created_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    transfer_date: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodDate>>>;
    trf_id: z.ZodString;
    source_inventory: z.ZodString;
    destination_inventory: z.ZodString;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    trf_id: string;
    source_inventory: string;
    destination_inventory: string;
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    transfer_date?: Date | null | undefined;
}, {
    trf_id: string;
    source_inventory: string;
    destination_inventory: string;
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    transfer_date?: Date | null | undefined;
}>;
export declare const updateTransferSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    created_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    transfer_date: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodDate>>>;
    trf_id: z.ZodOptional<z.ZodString>;
    source_inventory: z.ZodOptional<z.ZodString>;
    destination_inventory: z.ZodOptional<z.ZodString>;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    transfer_date?: Date | null | undefined;
    trf_id?: string | undefined;
    source_inventory?: string | undefined;
    destination_inventory?: string | undefined;
}, {
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    transfer_date?: Date | null | undefined;
    trf_id?: string | undefined;
    source_inventory?: string | undefined;
    destination_inventory?: string | undefined;
}>;
//# sourceMappingURL=validations.d.ts.map