import { z } from "zod";
export declare const insertCategorySchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    created_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    name: string;
    id?: string | undefined;
    description?: string | null | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
}, {
    name: string;
    id?: string | undefined;
    description?: string | null | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
}>;
export declare const updateCategorySchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    created_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    id?: string | undefined;
    name?: string | undefined;
    description?: string | null | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
}, {
    id?: string | undefined;
    name?: string | undefined;
    description?: string | null | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
}>;
//# sourceMappingURL=validations.d.ts.map