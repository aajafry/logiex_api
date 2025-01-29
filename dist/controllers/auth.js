"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const drizzle_orm_1 = require("drizzle-orm");
const zod_1 = require("zod");
const connection_1 = require("../database/connection");
const index_1 = require("../schemas/index");
const index_2 = require("../services/index");
const index_3 = require("../utils/index");
exports.authController = {
    register: (async (req, res) => {
        try {
            await index_1.registerUserSchema.parseAsync(req.body);
            const { name, email, password } = req.body;
            const existingUser = await (0, index_2.findUserByEmail)(email);
            if (existingUser) {
                return res.status(409).json({
                    message: `A user with the email "${email}" already exists. Please use a different email.`,
                });
            }
            const hashedPassword = await (0, index_3.hashPassword)(password);
            const [newUser] = await connection_1.db
                .insert(index_1.users)
                .values({
                name,
                email,
                password: hashedPassword,
                role: "admin",
            })
                .returning();
            if (!newUser) {
                return res.status(409).json({
                    message: `An error occurred while registering the user "${name}". Please try again.`,
                });
            }
            res.status(201).json({
                message: `User "${name}" has been registered successfully`,
                user: newUser,
            });
        }
        catch (error) {
            console.error("An error occurred while registering user:", error);
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error.errors.map((e) => e.message),
                });
            }
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while registering the user. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    login: (async (req, res) => {
        try {
            await index_1.loginUserSchema.parseAsync(req.body);
            const { email, password } = req.body;
            const existingUser = await (0, index_2.findUserWithRole)(email, index_3.userRolesEnum);
            if (!existingUser) {
                return res.status(404).json({
                    message: "Invalid credentials",
                });
            }
            const { id: existingUserId, name: existingUserName, email: existingUserEmail, password: existingUserPassword, role: existingUserRole, avatar: existingUserAvatar, failed_login_attempt_count: existingUserFailedLoginAttemptCount, login_count: existingUserLoginCount, } = existingUser;
            const isValidPassword = await bcrypt_1.default.compare(password, existingUserPassword);
            if (!isValidPassword) {
                await connection_1.db
                    .update(index_1.users)
                    .set({
                    failed_login_attempt_count: existingUserFailedLoginAttemptCount + 1,
                    failed_login_attempt_last_at: new Date().toISOString(),
                })
                    .where((0, drizzle_orm_1.eq)(index_1.users.id, existingUserId));
                return res.status(401).json({
                    message: "Invalid credentials",
                });
            }
            const payload = {
                id: existingUserId,
                name: existingUserName,
                email: existingUserEmail,
                role: existingUserRole,
                avatar: existingUserAvatar,
            };
            const token = (0, index_3.generateToken)(payload);
            await connection_1.db
                .update(index_1.users)
                .set({
                isOnline: true,
                last_login_at: new Date().toISOString(),
                login_count: existingUserLoginCount + 1,
            })
                .where((0, drizzle_orm_1.eq)(index_1.users.id, existingUserId))
                .returning();
            res.status(200).json({
                message: `The user "${payload.name}" has been logged in successfully`,
                user: payload,
                token,
            });
        }
        catch (error) {
            console.error("An error occurred while logging in a user:", error);
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error.errors.map((e) => e.message),
                });
            }
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while logging in the user. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    requestPasswordReset: (async (req, res) => {
        try {
            await index_1.verifyEmailUserSchema.parseAsync(req.body);
            const { email } = req.body;
            const existingUser = await (0, index_2.findUserWithRole)(email, index_3.userRolesEnum);
            if (!existingUser) {
                return res.status(404).json({
                    message: "Invalid credentials",
                });
            }
            const { id: existingUserId, name: existingUserName, email: existingUserEmail, role: existingUserRole, avatar: existingUserAvatar, } = existingUser;
            const payload = {
                id: existingUserId,
                name: existingUserName,
                email: existingUserEmail,
                role: existingUserRole,
                avatar: existingUserAvatar,
            };
            const token = (0, index_3.generateToken)(payload);
            await connection_1.db
                .update(index_1.users)
                .set({
                reset_password_token: token,
                reset_password_token_expired_at: new Date(new Date().getTime() + 10 * 60 * 1000).toISOString(),
            })
                .where((0, drizzle_orm_1.eq)(index_1.users.id, existingUserId))
                .returning();
            const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
            await (0, index_3.sendEmail)(email, "Password Reset Request", `Click here to reset your password: ${resetLink}`);
            res.status(200).json({
                message: `A password reset link has been sent to "${email}".`,
            });
        }
        catch (error) {
            console.error("An error occurred while requesting password reset:", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while requesting the password reset. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    resetPassword: (async (req, res) => {
        try {
            await index_1.resetPasswordUserSchema.parseAsync(req.body);
            const { reset_password_token: resetToken, password } = req.body;
            const [existingUser] = await connection_1.db
                .select()
                .from(index_1.users)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(index_1.users.reset_password_token, resetToken), (0, drizzle_orm_1.gte)(index_1.users.reset_password_token_expired_at, new Date())));
            if (!existingUser) {
                return res.status(404).json({
                    message: "Invalid credentials",
                });
            }
            const { id: existingUserId } = existingUser;
            const hashedPassword = await (0, index_3.hashPassword)(password);
            const [updateUserWithPassword] = await connection_1.db
                .update(index_1.users)
                .set({
                password: hashedPassword,
                reset_password_token: null,
                reset_password_token_expired_at: null,
                updated_at: new Date().toISOString(),
            })
                .where((0, drizzle_orm_1.eq)(index_1.users.id, existingUserId))
                .returning();
            if (!updateUserWithPassword) {
                return res.status(409).json({
                    message: "An error occurred while updating the password. Please try again.",
                });
            }
            const { id: updatedUserId, name: updatedUserName, email: updatedUserEmail, role: updatedUserRole, avatar: updatedUserAvatar, } = updateUserWithPassword;
            const payload = {
                id: updatedUserId,
                name: updatedUserName,
                email: updatedUserEmail,
                role: updatedUserRole,
                avatar: updatedUserAvatar,
            };
            res.status(200).json({
                message: "Password reset successful",
                user: payload,
            });
        }
        catch (error) {
            console.error("An error occurred while resetting password:", error);
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error.errors.map((e) => e.message),
                });
            }
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while resetting the password. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    logout: (async (req, res) => {
        try {
            const { id } = req.params;
            const [logoutUser] = await connection_1.db
                .update(index_1.users)
                .set({
                isOnline: false,
            })
                .where((0, drizzle_orm_1.eq)(index_1.users.id, id))
                .returning();
            if (!logoutUser) {
                return res.status(404).json({
                    message: `No user found with the provided ID "${id}". Please verify and try again.`,
                });
            }
            res.status(200).json({
                message: `The user "${logoutUser.name}" has been logged out successfully`,
            });
        }
        catch (error) {
            console.error("An error occurred while logging out a user:", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while logging out the user. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
};
