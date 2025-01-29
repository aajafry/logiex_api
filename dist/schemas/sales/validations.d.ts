import { z } from "zod";
export declare const insertSaleSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    created_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    inventory: z.ZodString;
    adjustment: z.ZodOptional<z.ZodNullable<z.ZodEffects<z.ZodOptional<z.ZodNumber>, number | undefined, number | undefined>>>;
    total_price: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    bill_id: z.ZodString;
    customer_id: z.ZodString;
    shipping_address: z.ZodString;
    status: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodEnum<[string, ...string[]]>>>>;
    sale_date: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodDate>>>;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    inventory: string;
    bill_id: string;
    customer_id: string;
    shipping_address: string;
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    adjustment?: number | null | undefined;
    total_price?: string | null | undefined;
    status?: string | null | undefined;
    sale_date?: Date | null | undefined;
}, {
    inventory: string;
    bill_id: string;
    customer_id: string;
    shipping_address: string;
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    adjustment?: number | null | undefined;
    total_price?: string | null | undefined;
    status?: string | null | undefined;
    sale_date?: Date | null | undefined;
}>;
export declare const updateSaleSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    created_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    inventory: z.ZodOptional<z.ZodString>;
    adjustment: z.ZodOptional<z.ZodNullable<z.ZodEffects<z.ZodOptional<z.ZodNumber>, number | undefined, number | undefined>>>;
    total_price: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    bill_id: z.ZodOptional<z.ZodString>;
    customer_id: z.ZodOptional<z.ZodString>;
    shipping_address: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodEnum<[string, ...string[]]>>>>;
    sale_date: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodDate>>>;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    inventory?: string | undefined;
    adjustment?: number | null | undefined;
    total_price?: string | null | undefined;
    bill_id?: string | undefined;
    customer_id?: string | undefined;
    shipping_address?: string | undefined;
    status?: string | null | undefined;
    sale_date?: Date | null | undefined;
}, {
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    inventory?: string | undefined;
    adjustment?: number | null | undefined;
    total_price?: string | null | undefined;
    bill_id?: string | undefined;
    customer_id?: string | undefined;
    shipping_address?: string | undefined;
    status?: string | null | undefined;
    sale_date?: Date | null | undefined;
}>;
//# sourceMappingURL=validations.d.ts.map