import { z } from "zod";
export declare const insertPurchaseSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    created_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    inventory: z.ZodString;
    mr_id: z.ZodString;
    vendor: z.ZodString;
    adjustment: z.ZodOptional<z.ZodNullable<z.ZodEffects<z.ZodOptional<z.ZodNumber>, number | undefined, number | undefined>>>;
    total_price: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    purchase_date: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodDate>>>;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    inventory: string;
    mr_id: string;
    vendor: string;
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    adjustment?: number | null | undefined;
    total_price?: string | null | undefined;
    purchase_date?: Date | null | undefined;
}, {
    inventory: string;
    mr_id: string;
    vendor: string;
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    adjustment?: number | null | undefined;
    total_price?: string | null | undefined;
    purchase_date?: Date | null | undefined;
}>;
export declare const updatePurchaseSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    created_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    inventory: z.ZodOptional<z.ZodString>;
    mr_id: z.ZodOptional<z.ZodString>;
    vendor: z.ZodOptional<z.ZodString>;
    adjustment: z.ZodOptional<z.ZodNullable<z.ZodEffects<z.ZodOptional<z.ZodNumber>, number | undefined, number | undefined>>>;
    total_price: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    purchase_date: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodDate>>>;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    inventory?: string | undefined;
    mr_id?: string | undefined;
    vendor?: string | undefined;
    adjustment?: number | null | undefined;
    total_price?: string | null | undefined;
    purchase_date?: Date | null | undefined;
}, {
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    inventory?: string | undefined;
    mr_id?: string | undefined;
    vendor?: string | undefined;
    adjustment?: number | null | undefined;
    total_price?: string | null | undefined;
    purchase_date?: Date | null | undefined;
}>;
//# sourceMappingURL=validations.d.ts.map