import { z } from "zod";
export declare const insertProductSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    created_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    price: z.ZodEffects<z.ZodEffects<z.ZodNumber, number, number>, number, number>;
    category: z.ZodString;
    sku: z.ZodString;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    name: string;
    price: number;
    category: string;
    sku: string;
    id?: string | undefined;
    description?: string | null | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
}, {
    name: string;
    price: number;
    category: string;
    sku: string;
    id?: string | undefined;
    description?: string | null | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
}>;
export declare const updateProductSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    created_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    price: z.ZodEffects<z.ZodOptional<z.ZodNumber>, number | undefined, number | undefined>;
    category: z.ZodOptional<z.ZodString>;
    sku: z.ZodOptional<z.ZodString>;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    id?: string | undefined;
    name?: string | undefined;
    description?: string | null | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    price?: number | undefined;
    category?: string | undefined;
    sku?: string | undefined;
}, {
    id?: string | undefined;
    name?: string | undefined;
    description?: string | null | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    price?: number | undefined;
    category?: string | undefined;
    sku?: string | undefined;
}>;
//# sourceMappingURL=validations.d.ts.map