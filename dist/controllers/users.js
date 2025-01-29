"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const zod_1 = require("zod");
const connection_1 = require("../database/connection");
const index_1 = require("../schemas/index");
const index_2 = require("../services/index");
const index_3 = require("../utils/index");
exports.usersController = {
    create: (async (req, res) => {
        try {
            await index_1.insertUserSchema.parseAsync(req.body);
            const { name, email, phone, password } = req.body;
            const existingUser = await (0, index_2.findUserByEmail)(email);
            if (existingUser) {
                return res.status(409).json({
                    message: `A user with the email "${email}" already exists. Please use a different email.`,
                });
            }
            if (phone) {
                const existingUser = await (0, index_2.findUserByPhone)(phone);
                if (existingUser) {
                    return res.status(409).json({
                        message: `A user with the phone number "${phone}" already exists. Please use a different phone number.`,
                    });
                }
            }
            const hashedPassword = await (0, index_3.hashPassword)(password);
            const [newUser] = await connection_1.db
                .insert(index_1.users)
                .values({
                ...req.body,
                password: hashedPassword,
                created_by: req.user?.id ?? null,
            })
                .returning();
            if (!newUser) {
                return res.status(409).json({
                    message: `An error occurred while creating the user "${name}". Please try again.`,
                });
            }
            res.status(201).json({
                message: `The user "${name}" has been created successfully`,
                user: newUser,
            });
        }
        catch (error) {
            console.error("An error occurred while creating user", error);
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error.errors.map((e) => e.message),
                });
            }
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while creating the user. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    retrieveAll: (async (req, res) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { role } = user;
        try {
            let allUsers;
            if (role === "admin") {
                allUsers = await connection_1.db.query.users.findMany({
                    orderBy: [(0, drizzle_orm_1.desc)(index_1.users.created_at)],
                    columns: {
                        password: false,
                        created_by: false,
                        reset_password_token: false,
                        reset_password_token_expired_at: false,
                    },
                    with: {
                        creator: {
                            columns: {
                                id: false,
                                password: false,
                                national_id: false,
                                driving_license_no: false,
                                passport_no: false,
                                last_login_at: false,
                                login_count: false,
                                failed_login_attempt_count: false,
                                failed_login_attempt_last_at: false,
                                reset_password_token: false,
                                reset_password_token_expired_at: false,
                                created_by: false,
                                created_at: false,
                                updated_at: false,
                            },
                        },
                        inventoryInCharges: {
                            columns: {
                                id: false,
                                employee_id: false,
                            },
                        },
                        captains: {
                            columns: {
                                id: false,
                                captain_id: false,
                                vehicle_id: false,
                            },
                            with: {
                                vehicle: {
                                    columns: {
                                        id: false,
                                    },
                                },
                            },
                        },
                    },
                });
            }
            else if (role === "inventory-manager") {
                allUsers = await connection_1.db.query.users.findMany({
                    where: (0, drizzle_orm_1.inArray)(index_1.users.role, ["inventory-in-charge", "captain"]),
                    columns: {
                        password: false,
                        created_by: false,
                        reset_password_token: false,
                        reset_password_token_expired_at: false,
                    },
                    with: {
                        creator: {
                            columns: {
                                id: false,
                                password: false,
                                national_id: false,
                                driving_license_no: false,
                                passport_no: false,
                                last_login_at: false,
                                login_count: false,
                                failed_login_attempt_count: false,
                                failed_login_attempt_last_at: false,
                                reset_password_token: false,
                                reset_password_token_expired_at: false,
                                created_by: false,
                                created_at: false,
                                updated_at: false,
                            },
                        },
                        inventoryInCharges: {
                            columns: {
                                id: false,
                                employee_id: false,
                            },
                        },
                        captains: {
                            columns: {
                                id: false,
                                captain_id: false,
                                vehicle_id: false,
                            },
                            with: {
                                vehicle: {
                                    columns: {
                                        id: false,
                                    },
                                },
                            },
                        },
                    },
                });
            }
            else if (role === "fleet-manager") {
                allUsers = await connection_1.db.query.users.findMany({
                    where: (0, drizzle_orm_1.eq)(index_1.users.role, "captain"),
                    columns: {
                        password: false,
                        created_by: false,
                        reset_password_token: false,
                        reset_password_token_expired_at: false,
                    },
                    with: {
                        creator: {
                            columns: {
                                id: false,
                                password: false,
                                national_id: false,
                                driving_license_no: false,
                                passport_no: false,
                                last_login_at: false,
                                login_count: false,
                                failed_login_attempt_count: false,
                                failed_login_attempt_last_at: false,
                                reset_password_token: false,
                                reset_password_token_expired_at: false,
                                created_by: false,
                                created_at: false,
                                updated_at: false,
                            },
                        },
                        inventoryInCharges: {
                            columns: {
                                id: false,
                                employee_id: false,
                            },
                        },
                        captains: {
                            columns: {
                                id: false,
                                captain_id: false,
                                vehicle_id: false,
                            },
                            with: {
                                vehicle: {
                                    columns: {
                                        id: false,
                                    },
                                },
                            },
                        },
                    },
                });
            }
            else {
                allUsers = await connection_1.db.query.users.findMany({
                    where: (0, drizzle_orm_1.eq)(index_1.users.role, "captain"),
                    columns: {
                        password: false,
                        created_by: false,
                        reset_password_token: false,
                        reset_password_token_expired_at: false,
                    },
                    with: {
                        creator: {
                            columns: {
                                id: false,
                                password: false,
                                national_id: false,
                                driving_license_no: false,
                                passport_no: false,
                                last_login_at: false,
                                login_count: false,
                                failed_login_attempt_count: false,
                                failed_login_attempt_last_at: false,
                                reset_password_token: false,
                                reset_password_token_expired_at: false,
                                created_by: false,
                                created_at: false,
                                updated_at: false,
                            },
                        },
                        inventoryInCharges: {
                            columns: {
                                id: false,
                                employee_id: false,
                            },
                        },
                        captains: {
                            columns: {
                                id: false,
                                captain_id: false,
                                vehicle_id: false,
                            },
                            with: {
                                vehicle: {
                                    columns: {
                                        id: false,
                                    },
                                },
                            },
                        },
                    },
                });
            }
            res.status(200).json({
                message: "Users retrieved successfully",
                users: allUsers,
            });
        }
        catch (error) {
            console.error("An error occurred while retrieving users", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while retrieving users. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    retrieveById: (async (req, res) => {
        try {
            const { id } = req.params;
            const user = await connection_1.db.query.users.findFirst({
                where: (0, drizzle_orm_1.eq)(index_1.users.id, id),
                orderBy: [(0, drizzle_orm_1.desc)(index_1.users.created_at)],
                columns: {
                    password: false,
                    created_by: false,
                    reset_password_token: false,
                    reset_password_token_expired_at: false,
                },
                with: {
                    creator: {
                        columns: {
                            id: false,
                            password: false,
                            national_id: false,
                            driving_license_no: false,
                            passport_no: false,
                            last_login_at: false,
                            login_count: false,
                            failed_login_attempt_count: false,
                            failed_login_attempt_last_at: false,
                            reset_password_token: false,
                            reset_password_token_expired_at: false,
                            created_by: false,
                            created_at: false,
                            updated_at: false,
                        },
                    },
                    inventoryInCharges: {
                        columns: {
                            id: false,
                            employee_id: false,
                        },
                    },
                    captains: {
                        columns: {
                            id: false,
                            captain_id: false,
                            vehicle_id: false,
                        },
                        with: {
                            vehicle: {
                                columns: {
                                    id: false,
                                },
                            },
                        },
                    },
                },
            });
            if (!user) {
                return res.status(404).json({
                    message: `No user found with the provided ID "${id}". Please verify the ID and try again.`,
                });
            }
            res.status(200).json({
                message: "User retrieved successfully",
                user,
            });
        }
        catch (error) {
            console.error("An error occurred while retrieving user", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while retrieving the user. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    updateById: (async (req, res) => {
        try {
            await index_1.updateUserSchema.parseAsync(req.body);
            const { id } = req.params;
            const { name, email, phone, avatar, address, password, role, national_id, driving_license, passport_no, } = req.body;
            const [existingUser] = await connection_1.db
                .select()
                .from(index_1.users)
                .where((0, drizzle_orm_1.eq)(index_1.users.id, id))
                .limit(1);
            if (!existingUser) {
                return res.status(404).json({
                    message: `No user found with the provided ID "${id}". Please verify the ID and try again.`,
                });
            }
            const { name: existingUserName, email: existingUserEmail, phone: existingUserPhone, avatar: existingUserAvatar, address: existingUserAddress, password: existingUserPassword, role: existingUserRole, national_id: existingUserNationalId, driving_license: existingUserDrivingLicense, passport_no: existingUserPassportNo, } = existingUser;
            if (email && email !== existingUserEmail) {
                const existingUser = await (0, index_2.findUserByEmail)(email);
                if (existingUser) {
                    return res.status(409).json({
                        message: `A user with the email "${email}" already exists. Please use a different email.`,
                    });
                }
            }
            if (phone && phone !== existingUserPhone) {
                const existingUser = await (0, index_2.findUserByPhone)(phone);
                if (existingUser) {
                    return res.status(409).json({
                        message: `A user with the phone number "${phone} already exists. Please use a different phone number.`,
                    });
                }
            }
            const hashedPassword = password
                ? await (0, index_3.hashPassword)(password)
                : existingUserPassword;
            const updatedData = {
                name: name || existingUserName,
                email: email || existingUserEmail,
                phone: phone || existingUserPhone,
                avatar: avatar || existingUserAvatar,
                address: address || existingUserAddress,
                password: hashedPassword,
                role: role || existingUserRole,
                national_id: national_id || existingUserNationalId,
                driving_license_no: driving_license || existingUserDrivingLicense,
                passport_no: passport_no || existingUserPassportNo,
                updated_at: new Date().toISOString(),
            };
            const [updatedUser] = await connection_1.db
                .update(index_1.users)
                .set(updatedData)
                .where((0, drizzle_orm_1.eq)(index_1.users.id, id))
                .returning();
            if (!updatedUser) {
                return res.status(404).json({
                    message: `An error occurred while updating the user "${existingUserName}". Please try again.`,
                });
            }
            res.status(200).json({
                message: `The user ${existingUserName} has been updated successfully`,
                user: updatedUser,
            });
        }
        catch (error) {
            console.error("An error occurred while updating user", error);
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error.errors.map((e) => e.message),
                });
            }
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while updating the user. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    deleteById: (async (req, res) => {
        try {
            const { id } = req.params;
            const [deletedUser] = await connection_1.db
                .delete(index_1.users)
                .where((0, drizzle_orm_1.eq)(index_1.users.id, id))
                .returning();
            if (!deletedUser) {
                return res.status(404).json({
                    message: `No user found with the provided ID "${id}". Please verify the ID and try again.`,
                });
            }
            res.status(200).json({
                message: `The user "${deletedUser.name}" has been deleted successfully`,
            });
        }
        catch (error) {
            console.error("An error occurred while deleting user", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while deleting the user. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
};
