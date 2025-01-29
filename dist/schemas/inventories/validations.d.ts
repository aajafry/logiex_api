import { z } from "zod";
export declare const insertInventorySchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    email: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    created_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    phone: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    address: z.ZodString;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    name: string;
    address: string;
    id?: string | undefined;
    email?: string | null | undefined;
    description?: string | null | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    phone?: string | null | undefined;
}, {
    name: string;
    address: string;
    id?: string | undefined;
    email?: string | null | undefined;
    description?: string | null | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    phone?: string | null | undefined;
}>;
export declare const updateInventorySchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    created_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    phone: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    address: z.ZodOptional<z.ZodString>;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    id?: string | undefined;
    name?: string | undefined;
    email?: string | null | undefined;
    description?: string | null | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    phone?: string | null | undefined;
    address?: string | undefined;
}, {
    id?: string | undefined;
    name?: string | undefined;
    email?: string | null | undefined;
    description?: string | null | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    phone?: string | null | undefined;
    address?: string | undefined;
}>;
//# sourceMappingURL=validations.d.ts.map