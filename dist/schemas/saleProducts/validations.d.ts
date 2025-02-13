import { z } from "zod";
export declare const insertSaleProductSchema: z.ZodObject<Omit<{
    id: z.ZodOptional<z.ZodString>;
    created_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    inventory: z.ZodString;
    mr_id: z.ZodString;
    product: z.ZodString;
    quantity: z.ZodNumber;
    total_price: z.ZodString;
    bill_id: z.ZodString;
    unit_price: z.ZodEffects<z.ZodEffects<z.ZodNumber, number, number>, number, number>;
    discount: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
}, "inventory" | "mr_id" | "total_price" | "bill_id">, z.UnknownKeysParam, z.ZodTypeAny, {
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
export declare const updateSaleProductSchema: z.ZodObject<Omit<{
    id: z.ZodOptional<z.ZodString>;
    created_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    inventory: z.ZodString;
    mr_id: z.ZodString;
    product: z.ZodString;
    quantity: z.ZodOptional<z.ZodNumber>;
    total_price: z.ZodString;
    bill_id: z.ZodString;
    unit_price: z.ZodEffects<z.ZodOptional<z.ZodNumber>, number | undefined, number | undefined>;
    discount: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
}, "inventory" | "mr_id" | "product" | "total_price" | "bill_id">, z.UnknownKeysParam, z.ZodTypeAny, {
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    quantity?: number | undefined;
    unit_price?: number | undefined;
    discount?: number | null | undefined;
}, {
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    quantity?: number | undefined;
    unit_price?: number | undefined;
    discount?: number | null | undefined;
}>;
//# sourceMappingURL=validations.d.ts.map