import { z } from "zod";
export declare const insertUserSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    email: z.ZodString;
    role: z.ZodOptional<z.ZodNullable<z.ZodEnum<[string, ...string[]]>>>;
    avatar: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    created_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    address: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    password: z.ZodString;
    national_id: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    driving_license_no: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    passport_no: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    isOnline: z.ZodOptional<z.ZodBoolean>;
    last_login_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    login_count: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    failed_login_attempt_count: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    failed_login_attempt_last_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    validation_token: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    validation_token_expired_at: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
    reset_password_token: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    reset_password_token_expired_at: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
    created_by: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
    id?: string | undefined;
    role?: string | null | undefined;
    avatar?: string | null | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    phone?: string | null | undefined;
    address?: string | null | undefined;
    national_id?: string | null | undefined;
    driving_license_no?: string | null | undefined;
    passport_no?: string | null | undefined;
    isOnline?: boolean | undefined;
    last_login_at?: string | null | undefined;
    login_count?: number | null | undefined;
    failed_login_attempt_count?: number | null | undefined;
    failed_login_attempt_last_at?: string | null | undefined;
    validation_token?: string | null | undefined;
    validation_token_expired_at?: Date | null | undefined;
    reset_password_token?: string | null | undefined;
    reset_password_token_expired_at?: Date | null | undefined;
    created_by?: string | null | undefined;
}, {
    name: string;
    email: string;
    password: string;
    id?: string | undefined;
    role?: string | null | undefined;
    avatar?: string | null | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    phone?: string | null | undefined;
    address?: string | null | undefined;
    national_id?: string | null | undefined;
    driving_license_no?: string | null | undefined;
    passport_no?: string | null | undefined;
    isOnline?: boolean | undefined;
    last_login_at?: string | null | undefined;
    login_count?: number | null | undefined;
    failed_login_attempt_count?: number | null | undefined;
    failed_login_attempt_last_at?: string | null | undefined;
    validation_token?: string | null | undefined;
    validation_token_expired_at?: Date | null | undefined;
    reset_password_token?: string | null | undefined;
    reset_password_token_expired_at?: Date | null | undefined;
    created_by?: string | null | undefined;
}>;
export declare const updateUserSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodEnum<[string, ...string[]]>>>>;
    avatar: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    created_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    phone: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    address: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    password: z.ZodOptional<z.ZodString>;
    national_id: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    driving_license_no: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    passport_no: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    isOnline: z.ZodOptional<z.ZodBoolean>;
    last_login_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    login_count: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    failed_login_attempt_count: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    failed_login_attempt_last_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    validation_token: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    validation_token_expired_at: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
    reset_password_token: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    reset_password_token_expired_at: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
    created_by: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    id?: string | undefined;
    name?: string | undefined;
    email?: string | undefined;
    role?: string | null | undefined;
    avatar?: string | null | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    phone?: string | null | undefined;
    address?: string | null | undefined;
    password?: string | undefined;
    national_id?: string | null | undefined;
    driving_license_no?: string | null | undefined;
    passport_no?: string | null | undefined;
    isOnline?: boolean | undefined;
    last_login_at?: string | null | undefined;
    login_count?: number | null | undefined;
    failed_login_attempt_count?: number | null | undefined;
    failed_login_attempt_last_at?: string | null | undefined;
    validation_token?: string | null | undefined;
    validation_token_expired_at?: Date | null | undefined;
    reset_password_token?: string | null | undefined;
    reset_password_token_expired_at?: Date | null | undefined;
    created_by?: string | null | undefined;
}, {
    id?: string | undefined;
    name?: string | undefined;
    email?: string | undefined;
    role?: string | null | undefined;
    avatar?: string | null | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    phone?: string | null | undefined;
    address?: string | null | undefined;
    password?: string | undefined;
    national_id?: string | null | undefined;
    driving_license_no?: string | null | undefined;
    passport_no?: string | null | undefined;
    isOnline?: boolean | undefined;
    last_login_at?: string | null | undefined;
    login_count?: number | null | undefined;
    failed_login_attempt_count?: number | null | undefined;
    failed_login_attempt_last_at?: string | null | undefined;
    validation_token?: string | null | undefined;
    validation_token_expired_at?: Date | null | undefined;
    reset_password_token?: string | null | undefined;
    reset_password_token_expired_at?: Date | null | undefined;
    created_by?: string | null | undefined;
}>;
export declare const registerUserSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    email: z.ZodString;
    role: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    avatar: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    created_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    address: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    password: z.ZodString;
    national_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    driving_license_no: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    passport_no: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isOnline: z.ZodOptional<z.ZodBoolean>;
    last_login_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    login_count: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    failed_login_attempt_count: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    failed_login_attempt_last_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    validation_token: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    validation_token_expired_at: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
    reset_password_token: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    reset_password_token_expired_at: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
    created_by: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
    id?: string | undefined;
    role?: string | null | undefined;
    avatar?: string | null | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    phone?: string | null | undefined;
    address?: string | null | undefined;
    national_id?: string | null | undefined;
    driving_license_no?: string | null | undefined;
    passport_no?: string | null | undefined;
    isOnline?: boolean | undefined;
    last_login_at?: string | null | undefined;
    login_count?: number | null | undefined;
    failed_login_attempt_count?: number | null | undefined;
    failed_login_attempt_last_at?: string | null | undefined;
    validation_token?: string | null | undefined;
    validation_token_expired_at?: Date | null | undefined;
    reset_password_token?: string | null | undefined;
    reset_password_token_expired_at?: Date | null | undefined;
    created_by?: string | null | undefined;
}, {
    name: string;
    email: string;
    password: string;
    id?: string | undefined;
    role?: string | null | undefined;
    avatar?: string | null | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    phone?: string | null | undefined;
    address?: string | null | undefined;
    national_id?: string | null | undefined;
    driving_license_no?: string | null | undefined;
    passport_no?: string | null | undefined;
    isOnline?: boolean | undefined;
    last_login_at?: string | null | undefined;
    login_count?: number | null | undefined;
    failed_login_attempt_count?: number | null | undefined;
    failed_login_attempt_last_at?: string | null | undefined;
    validation_token?: string | null | undefined;
    validation_token_expired_at?: Date | null | undefined;
    reset_password_token?: string | null | undefined;
    reset_password_token_expired_at?: Date | null | undefined;
    created_by?: string | null | undefined;
}>;
export declare const loginUserSchema: z.ZodObject<Omit<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    email: z.ZodString;
    role: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    avatar: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    created_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    address: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    password: z.ZodString;
    national_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    driving_license_no: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    passport_no: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isOnline: z.ZodOptional<z.ZodBoolean>;
    last_login_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    login_count: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    failed_login_attempt_count: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    failed_login_attempt_last_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    validation_token: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    validation_token_expired_at: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
    reset_password_token: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    reset_password_token_expired_at: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
    created_by: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "name">, z.UnknownKeysParam, z.ZodTypeAny, {
    email: string;
    password: string;
    id?: string | undefined;
    role?: string | null | undefined;
    avatar?: string | null | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    phone?: string | null | undefined;
    address?: string | null | undefined;
    national_id?: string | null | undefined;
    driving_license_no?: string | null | undefined;
    passport_no?: string | null | undefined;
    isOnline?: boolean | undefined;
    last_login_at?: string | null | undefined;
    login_count?: number | null | undefined;
    failed_login_attempt_count?: number | null | undefined;
    failed_login_attempt_last_at?: string | null | undefined;
    validation_token?: string | null | undefined;
    validation_token_expired_at?: Date | null | undefined;
    reset_password_token?: string | null | undefined;
    reset_password_token_expired_at?: Date | null | undefined;
    created_by?: string | null | undefined;
}, {
    email: string;
    password: string;
    id?: string | undefined;
    role?: string | null | undefined;
    avatar?: string | null | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    phone?: string | null | undefined;
    address?: string | null | undefined;
    national_id?: string | null | undefined;
    driving_license_no?: string | null | undefined;
    passport_no?: string | null | undefined;
    isOnline?: boolean | undefined;
    last_login_at?: string | null | undefined;
    login_count?: number | null | undefined;
    failed_login_attempt_count?: number | null | undefined;
    failed_login_attempt_last_at?: string | null | undefined;
    validation_token?: string | null | undefined;
    validation_token_expired_at?: Date | null | undefined;
    reset_password_token?: string | null | undefined;
    reset_password_token_expired_at?: Date | null | undefined;
    created_by?: string | null | undefined;
}>;
export declare const verifyEmailUserSchema: z.ZodObject<Omit<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    email: z.ZodString;
    role: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    avatar: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    created_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    address: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    password: z.ZodString;
    national_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    driving_license_no: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    passport_no: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isOnline: z.ZodOptional<z.ZodBoolean>;
    last_login_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    login_count: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    failed_login_attempt_count: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    failed_login_attempt_last_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    validation_token: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    validation_token_expired_at: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
    reset_password_token: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    reset_password_token_expired_at: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
    created_by: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "name" | "password">, z.UnknownKeysParam, z.ZodTypeAny, {
    email: string;
    id?: string | undefined;
    role?: string | null | undefined;
    avatar?: string | null | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    phone?: string | null | undefined;
    address?: string | null | undefined;
    national_id?: string | null | undefined;
    driving_license_no?: string | null | undefined;
    passport_no?: string | null | undefined;
    isOnline?: boolean | undefined;
    last_login_at?: string | null | undefined;
    login_count?: number | null | undefined;
    failed_login_attempt_count?: number | null | undefined;
    failed_login_attempt_last_at?: string | null | undefined;
    validation_token?: string | null | undefined;
    validation_token_expired_at?: Date | null | undefined;
    reset_password_token?: string | null | undefined;
    reset_password_token_expired_at?: Date | null | undefined;
    created_by?: string | null | undefined;
}, {
    email: string;
    id?: string | undefined;
    role?: string | null | undefined;
    avatar?: string | null | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    phone?: string | null | undefined;
    address?: string | null | undefined;
    national_id?: string | null | undefined;
    driving_license_no?: string | null | undefined;
    passport_no?: string | null | undefined;
    isOnline?: boolean | undefined;
    last_login_at?: string | null | undefined;
    login_count?: number | null | undefined;
    failed_login_attempt_count?: number | null | undefined;
    failed_login_attempt_last_at?: string | null | undefined;
    validation_token?: string | null | undefined;
    validation_token_expired_at?: Date | null | undefined;
    reset_password_token?: string | null | undefined;
    reset_password_token_expired_at?: Date | null | undefined;
    created_by?: string | null | undefined;
}>;
export declare const resetPasswordUserSchema: z.ZodObject<Omit<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    email: z.ZodString;
    role: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    avatar: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    created_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    address: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    password: z.ZodString;
    national_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    driving_license_no: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    passport_no: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isOnline: z.ZodOptional<z.ZodBoolean>;
    last_login_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    login_count: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    failed_login_attempt_count: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    failed_login_attempt_last_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    validation_token: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    validation_token_expired_at: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
    reset_password_token: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    reset_password_token_expired_at: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
    created_by: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "name" | "email">, z.UnknownKeysParam, z.ZodTypeAny, {
    password: string;
    id?: string | undefined;
    role?: string | null | undefined;
    avatar?: string | null | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    phone?: string | null | undefined;
    address?: string | null | undefined;
    national_id?: string | null | undefined;
    driving_license_no?: string | null | undefined;
    passport_no?: string | null | undefined;
    isOnline?: boolean | undefined;
    last_login_at?: string | null | undefined;
    login_count?: number | null | undefined;
    failed_login_attempt_count?: number | null | undefined;
    failed_login_attempt_last_at?: string | null | undefined;
    validation_token?: string | null | undefined;
    validation_token_expired_at?: Date | null | undefined;
    reset_password_token?: string | null | undefined;
    reset_password_token_expired_at?: Date | null | undefined;
    created_by?: string | null | undefined;
}, {
    password: string;
    id?: string | undefined;
    role?: string | null | undefined;
    avatar?: string | null | undefined;
    created_at?: string | null | undefined;
    updated_at?: string | null | undefined;
    phone?: string | null | undefined;
    address?: string | null | undefined;
    national_id?: string | null | undefined;
    driving_license_no?: string | null | undefined;
    passport_no?: string | null | undefined;
    isOnline?: boolean | undefined;
    last_login_at?: string | null | undefined;
    login_count?: number | null | undefined;
    failed_login_attempt_count?: number | null | undefined;
    failed_login_attempt_last_at?: string | null | undefined;
    validation_token?: string | null | undefined;
    validation_token_expired_at?: Date | null | undefined;
    reset_password_token?: string | null | undefined;
    reset_password_token_expired_at?: Date | null | undefined;
    created_by?: string | null | undefined;
}>;
//# sourceMappingURL=validations.d.ts.map