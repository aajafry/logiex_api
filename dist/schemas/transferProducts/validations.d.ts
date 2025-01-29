import { z } from "zod";
export declare const insertTransferProductSchema: z.ZodObject<Omit<{
    id: z.ZodOptional<z.ZodString>;
    created_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    mr_id: z.ZodString;
    product: z.ZodString;
    quantity: z.ZodNumber;
    trf_id: z.ZodString;
}, "trf_id">, z.UnknownKeysParam, z.ZodTypeAny, {
    mr_id: string;
    product: string;
    quantity: number;
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
}, {
    mr_id: string;
    product: string;
    quantity: number;
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
}>;
export declare const updateTransferProductSchema: z.ZodObject<Omit<{
    id: z.ZodOptional<z.ZodString>;
    created_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    mr_id: z.ZodString;
    product: z.ZodString;
    quantity: z.ZodOptional<z.ZodNumber>;
    trf_id: z.ZodString;
}, "mr_id" | "product" | "trf_id">, z.UnknownKeysParam, z.ZodTypeAny, {
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    quantity?: number | undefined;
}, {
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    quantity?: number | undefined;
}>;
//# sourceMappingURL=validations.d.ts.map