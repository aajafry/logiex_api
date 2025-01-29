import { z } from "zod";
export declare const insertInventoryEmploymentSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    created_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    employee_id: z.ZodString;
    inventory: z.ZodString;
    hire_date: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodDate>>>;
    termination_date: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    resign_date: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    transfer_date: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    employee_status: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    employee_id: string;
    inventory: string;
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    hire_date?: Date | null | undefined;
    termination_date?: string | null | undefined;
    resign_date?: string | null | undefined;
    transfer_date?: string | null | undefined;
    employee_status?: boolean | null | undefined;
}, {
    employee_id: string;
    inventory: string;
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    hire_date?: Date | null | undefined;
    termination_date?: string | null | undefined;
    resign_date?: string | null | undefined;
    transfer_date?: string | null | undefined;
    employee_status?: boolean | null | undefined;
}>;
export declare const updateInventoryEmploymentSchema: z.ZodObject<Omit<{
    id: z.ZodOptional<z.ZodString>;
    created_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    employee_id: z.ZodString;
    inventory: z.ZodString;
    hire_date: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    termination_date: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodDate>>>;
    resign_date: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodDate>>>;
    transfer_date: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodDate>>>;
    employee_status: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
}, "employee_id" | "inventory" | "hire_date">, z.UnknownKeysParam, z.ZodTypeAny, {
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    termination_date?: Date | null | undefined;
    resign_date?: Date | null | undefined;
    transfer_date?: Date | null | undefined;
    employee_status?: boolean | null | undefined;
}, {
    id?: string | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    termination_date?: Date | null | undefined;
    resign_date?: Date | null | undefined;
    transfer_date?: Date | null | undefined;
    employee_status?: boolean | null | undefined;
}>;
//# sourceMappingURL=validations.d.ts.map