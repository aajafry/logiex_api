import { z } from "zod";
export declare const insertVendorSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    email: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    created_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    phone: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    address: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    name: string;
    id?: string | undefined;
    email?: string | null | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    phone?: string | null | undefined;
    address?: string | null | undefined;
}, {
    name: string;
    id?: string | undefined;
    email?: string | null | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    phone?: string | null | undefined;
    address?: string | null | undefined;
}>;
export declare const updateVendorSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    created_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    phone: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    address: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    id?: string | undefined;
    name?: string | undefined;
    email?: string | null | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    phone?: string | null | undefined;
    address?: string | null | undefined;
}, {
    id?: string | undefined;
    name?: string | undefined;
    email?: string | null | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    phone?: string | null | undefined;
    address?: string | null | undefined;
}>;
//# sourceMappingURL=validations.d.ts.map