export interface IUser {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    address?: string;
    password: string;
    role?: string;
    national_id?: string;
    driving_license_no?: string;
    passport_no?: string;
    isOnline: boolean;
    last_login_at?: string;
    login_count?: number;
    failed_login_attempt_count?: number;
    failed_login_attempt_last_at?: string;
    validation_token?: string;
    validation_token_expired_at?: string;
    reset_password_token?: string;
    reset_password_token_expired_at?: string;
    created_by: string;
    created_at: string;
    updated_at?: string;
}
//# sourceMappingURL=user.d.ts.map