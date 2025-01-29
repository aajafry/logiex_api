import { z } from "zod";
export declare const insertPurchaseProductSchema: z.ZodObject<Omit<{
    id: z.ZodOptional<z.ZodString>;
    created_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    mr_id: z.ZodString;
    product: z.ZodString;
    quantity: z.ZodNumber;
    total_price: z.ZodString;
    unit_price: z.ZodEffects<z.ZodEffects<z.ZodNumber, number, number>, number, number>;
    discount: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
}, "mr_id" | "total_price">, z.UnknownKeysParam, z.ZodTypeAny, {
    product: string;
    quantity: number;
    unit_price: number;
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    discount?: number | null | undefined;
}, {
    product: string;
    quantity: number;
    unit_price: number;
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    discount?: number | null | undefined;
}>;
export declare const updatePurchaseProductSchema: z.ZodObject<Omit<{
    id: z.ZodOptional<z.ZodString>;
    created_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    mr_id: z.ZodString;
    product: z.ZodString;
    quantity: z.ZodOptional<z.ZodNumber>;
    total_price: z.ZodString;
    unit_price: z.ZodEffects<z.ZodOptional<z.ZodNumber>, number | undefined, number | undefined>;
    discount: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
}, "quantity" | "unit_price" | "discount">, z.UnknownKeysParam, z.ZodTypeAny, {
    mr_id: string;
    product: string;
    total_price: string;
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
}, {
    mr_id: string;
    product: string;
    total_price: string;
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
}>;
//# sourceMappingURL=validations.d.ts.map