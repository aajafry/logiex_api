"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoriesController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const zod_1 = require("zod");
const connection_1 = require("../database/connection");
const index_1 = require("../schemas/index");
const index_2 = require("../services/index");
exports.inventoriesController = {
    create: (async (req, res) => {
        try {
            await index_1.insertInventorySchema.parseAsync(req.body);
            const { name, email, phone, description, address } = req.body;
            if (name) {
                const existingInventory = await (0, index_2.findInventoryByName)(name);
                if (existingInventory) {
                    return res.status(409).json({
                        message: `An inventory with the name "${name}" already exists. Please choose a different name.`,
                    });
                }
            }
            if (email) {
                const existingInventory = await (0, index_2.findInventoryByEmail)(email);
                if (existingInventory) {
                    return res.status(409).json({
                        message: `An inventory with the email "${email}" already exists. Please use a different email.`,
                    });
                }
            }
            if (phone) {
                const existingInventory = await (0, index_2.findInventoryByPhone)(phone);
                if (existingInventory) {
                    return res.status(409).json({
                        message: `An inventory with the phone number "${phone}" already exists. Please use a different phone number.`,
                    });
                }
            }
            const [newInventory] = await connection_1.db
                .insert(index_1.inventories)
                .values({ ...req.body })
                .returning();
            if (!newInventory) {
                return res.status(409).json({
                    message: `An error occurred while creating the inventory "${name}". Please try again.`,
                });
            }
            res.status(201).json({
                message: `The inventory "${name}" has been created successfully.`,
                inventory: newInventory,
            });
        }
        catch (error) {
            console.error("An error occurred while creating inventory:", error);
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error.errors.map((e) => e.message),
                });
            }
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while creating the inventory. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    retrieveAll: (async (req, res) => {
        try {
            const allInventories = await connection_1.db.query.inventories.findMany({
                orderBy: [(0, drizzle_orm_1.desc)(index_1.inventories.created_at)],
                with: {
                    inventories: {
                        columns: {
                            id: false,
                            inventory: false,
                        },
                    },
                    purchases: {
                        columns: {
                            id: false,
                            inventory: false,
                        },
                    },
                    sales: {
                        columns: {
                            id: false,
                            inventory: false,
                            customer_id: false,
                        },
                        with: {
                            customer: {
                                columns: {
                                    id: false,
                                    name: true,
                                    email: true,
                                    phone: true,
                                },
                            },
                        },
                    },
                    saleProducts: false,
                    employees: {
                        columns: {
                            id: false,
                            inventory: false,
                            employee_id: false,
                        },
                        with: {
                            employee: {
                                columns: {
                                    id: false,
                                    password: false,
                                    last_login_at: false,
                                    login_count: false,
                                    failed_login_attempt_count: false,
                                    failed_login_attempt_last_at: false,
                                    reset_password_token: false,
                                    reset_password_token_expired_at: false,
                                    created_by: false,
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
                                },
                            },
                        },
                    },
                    source: {
                        columns: {
                            id: false,
                            source_inventory: false,
                        },
                    },
                    destination: {
                        columns: {
                            id: false,
                            destination_inventory: false,
                        },
                    },
                },
            });
            res.status(200).json({
                message: "Inventories retrieved successfully",
                inventories: allInventories,
            });
        }
        catch (error) {
            console.error("An error occurred while retrieving inventories:", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while retrieving inventories. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    retrieveByName: (async (req, res) => {
        try {
            const name = req.params.name.replace(/-/g, " ");
            const inventory = await connection_1.db.query.inventories.findFirst({
                where: (0, drizzle_orm_1.ilike)(index_1.inventories.name, name),
                orderBy: [(0, drizzle_orm_1.desc)(index_1.inventories.created_at)],
                with: {
                    inventories: {
                        columns: {
                            id: false,
                            inventory: false,
                        },
                    },
                    purchases: {
                        columns: {
                            id: false,
                            inventory: false,
                        },
                    },
                    sales: {
                        columns: {
                            id: false,
                            inventory: false,
                            customer_id: false,
                        },
                        with: {
                            customer: {
                                columns: {
                                    id: false,
                                    name: true,
                                    email: true,
                                    phone: true,
                                },
                            },
                        },
                    },
                    saleProducts: false,
                    employees: {
                        columns: {
                            id: false,
                            inventory: false,
                            employee_id: false,
                        },
                        with: {
                            employee: {
                                columns: {
                                    id: false,
                                    password: false,
                                    last_login_at: false,
                                    login_count: false,
                                    failed_login_attempt_count: false,
                                    failed_login_attempt_last_at: false,
                                    reset_password_token: false,
                                    reset_password_token_expired_at: false,
                                    created_by: false,
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
                                },
                            },
                        },
                    },
                    source: {
                        columns: {
                            id: false,
                            source_inventory: false,
                        },
                    },
                    destination: {
                        columns: {
                            id: false,
                            destination_inventory: false,
                        },
                    },
                },
            });
            if (!inventory) {
                return res.status(404).json({
                    message: `The inventory "${name}" was not found. Please verify the name and try again.`,
                });
            }
            res.status(200).json({
                message: "Inventory retrieved successfully",
                inventory,
            });
        }
        catch (error) {
            console.error("An error occurred while retrieving inventory by name:", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while retrieving the inventory. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    updateByName: (async (req, res) => {
        try {
            await index_1.updateInventorySchema.parseAsync(req.body);
            const name = req.params.name.replace(/-/g, " ");
            const { name: newName, email, phone, description, address } = req.body;
            const existingInventory = await (0, index_2.findInventoryByName)(name);
            if (!existingInventory) {
                return res.status(404).json({
                    message: `The inventory "${name}" was not found. Please verify the name.`,
                });
            }
            const { name: existingInventoryName, email: existingInventoryEmail, phone: existingInventoryPhone, description: existingInventoryDescription, address: existingInventoryAddress, } = existingInventory;
            if (newName && newName !== existingInventoryName) {
                const existingInventory = await (0, index_2.findInventoryByName)(newName);
                if (existingInventory) {
                    return res.status(409).json({
                        message: `An inventory with the name "${newName}" already exists. Please choose a different name.`,
                    });
                }
            }
            if (email && email !== existingInventoryEmail) {
                const existingInventory = await (0, index_2.findInventoryByEmail)(email);
                if (existingInventory) {
                    return res.status(409).json({
                        message: `An inventory with the email "${email}" already exists. Please use a different email.`,
                    });
                }
            }
            if (phone && phone !== existingInventoryPhone) {
                const existingInventory = await (0, index_2.findInventoryByPhone)(phone);
                if (existingInventory) {
                    return res.status(409).json({
                        message: `An inventory with the phone number "${phone}" already exists. Please use a different phone number.`,
                    });
                }
            }
            const updatedData = {
                name: newName || existingInventoryName,
                email: email || existingInventoryEmail,
                phone: phone || existingInventoryPhone,
                description: description || existingInventoryDescription,
                address: address || existingInventoryAddress,
                updated_at: new Date().toISOString(),
            };
            const [updatedInventory] = await connection_1.db
                .update(index_1.inventories)
                .set(updatedData)
                .where((0, drizzle_orm_1.ilike)(index_1.inventories.name, name))
                .returning();
            if (!updatedInventory) {
                return res.status(409).json({
                    message: `An error occurred while updating the inventory "${name}". Please try again.`,
                });
            }
            res.status(200).json({
                message: `The inventory "${name}" has been updated successfully.`,
                inventory: updatedInventory,
            });
        }
        catch (error) {
            console.error("An error occurred while updating inventory by name:", error);
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error.errors.map((e) => e.message),
                });
            }
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while updating the inventory. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    deleteByName: (async (req, res) => {
        try {
            const name = req.params.name.replace(/-/g, " ");
            const [deletedInventory] = await connection_1.db
                .delete(index_1.inventories)
                .where((0, drizzle_orm_1.ilike)(index_1.inventories.name, name))
                .returning();
            if (!deletedInventory) {
                return res.status(404).json({
                    message: `The inventory "${name}" was not found. Please verify the name.`,
                });
            }
            res.status(200).json({
                message: `The inventory "${name}" has been deleted successfully.`,
            });
        }
        catch (error) {
            console.error("An error occurred while deleting inventory by name:", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while deleting the inventory. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
};
