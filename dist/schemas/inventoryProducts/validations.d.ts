import { z } from "zod";
export declare const insertInventoryProductSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    created_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    inventory: z.ZodString;
    mr_id: z.ZodString;
    product: z.ZodString;
    quantity: z.ZodOptional<z.ZodNumber>;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    inventory: string;
    mr_id: string;
    product: string;
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    quantity?: number | undefined;
}, {
    inventory: string;
    mr_id: string;
    product: string;
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    quantity?: number | undefined;
}>;
export declare const updateInventoryProductSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    created_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    inventory: z.ZodString;
    mr_id: z.ZodString;
    product: z.ZodString;
    quantity: z.ZodOptional<z.ZodNumber>;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    inventory: string;
    mr_id: string;
    product: string;
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    quantity?: number | undefined;
}, {
    inventory: string;
    mr_id: string;
    product: string;
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    quantity?: number | undefined;
}>;
//# sourceMappingURL=validations.d.ts.map