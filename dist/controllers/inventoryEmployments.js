"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryEmploymentsController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const zod_1 = require("zod");
const connection_1 = require("../database/connection");
const index_1 = require("../schemas/index");
const index_2 = require("../services/index");
exports.inventoryEmploymentsController = {
    create: (async (req, res) => {
        try {
            const { employee_id, inventory, hire_date } = req.body;
            await index_1.insertInventoryEmploymentSchema.parseAsync({
                employee_id,
                inventory,
                hire_date,
            });
            const userHasPermission = await (0, index_2.findUserByIdAndRole)(employee_id, "inventory-in-charge");
            if (!userHasPermission) {
                return res.status(403).json({
                    message: "Employee does not have permissions to associate with inventory.",
                });
            }
            const activeAssignment = await (0, index_2.activeEmpTracker)(inventory);
            if (activeAssignment) {
                return res.status(409).json({
                    message: "An active employee is already associated with this inventory. Please check the assignment.",
                });
            }
            const [newAssignment] = await connection_1.db
                .insert(index_1.inventoryEmployments)
                .values({
                employee_id,
                inventory,
                hire_date,
                employee_status: true,
            })
                .returning();
            if (!newAssignment) {
                return res.status(409).json({
                    message: "An error occurred while creating the inventory assignment. Please try again.",
                });
            }
            res.status(201).json({
                message: "Inventory assignment created successfully.",
                assignment: newAssignment,
            });
        }
        catch (error) {
            console.error("An error occurred while creating the employee assignment:", error);
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error.errors.map((e) => e.message),
                });
            }
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while creating the employee assignment. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    retrieveAll: (async (req, res) => {
        try {
            const allAssignments = await connection_1.db.query.inventoryEmployments.findMany({
                orderBy: [(0, drizzle_orm_1.desc)(index_1.inventoryEmployments.created_at)],
                columns: {
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
            });
            res.status(200).json({
                message: "All inventories with associated employees retrieved successfully.",
                assignments: allAssignments,
            });
        }
        catch (error) {
            console.error("An error occurred while retrieving all inventories with associated employees:", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while retrieving all inventories with associated employees. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    retrieveById: (async (req, res) => {
        try {
            const { id } = req.params;
            const assignment = await connection_1.db.query.inventoryEmployments.findFirst({
                where: (0, drizzle_orm_1.eq)(index_1.inventoryEmployments.id, id),
                orderBy: [(0, drizzle_orm_1.desc)(index_1.inventoryEmployments.created_at)],
                columns: {
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
            });
            if (!assignment) {
                return res.status(404).json({
                    message: `Inventory assignment with associated employee not found with the provided ID "${id}". Please verify the ID.`,
                });
            }
            res.status(200).json({
                message: "Inventory assignment with associated employee retrieved successfully.",
                assignment,
            });
        }
        catch (error) {
            console.error("An error occurred while retrieving the inventory assignment:", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while retrieving the inventory assignment. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    updateById: (async (req, res) => {
        try {
            const { id } = req.params;
            const { termination_date, resign_date, transfer_date } = req.body;
            await index_1.updateInventoryEmploymentSchema.parseAsync({
                termination_date,
                resign_date,
                transfer_date,
            });
            const [existingAssignment] = await connection_1.db
                .select()
                .from(index_1.inventoryEmployments)
                .where((0, drizzle_orm_1.eq)(index_1.inventoryEmployments.id, id))
                .limit(1);
            if (!existingAssignment) {
                return res.status(404).json({
                    message: `Inventory assignment with associated employee not found with the provided ID "${id}". Please verify the ID.`,
                });
            }
            const { termination_date: existingAssignmentTerminationDate, resign_date: existingAssignmentResignDate, transfer_date: existingAssignmentTransferDate, } = existingAssignment;
            const updatedData = {
                termination_date: termination_date
                    ? new Date(termination_date).toISOString()
                    : existingAssignmentTerminationDate,
                resign_date: resign_date
                    ? new Date(resign_date).toISOString()
                    : existingAssignmentResignDate,
                transfer_date: transfer_date
                    ? new Date(transfer_date).toISOString()
                    : existingAssignmentTransferDate,
                updated_at: new Date().toISOString(),
                employee_status: false,
            };
            const [updatedAssignment] = await connection_1.db
                .update(index_1.inventoryEmployments)
                .set(updatedData)
                .where((0, drizzle_orm_1.eq)(index_1.inventoryEmployments.id, id))
                .returning();
            if (!updatedAssignment) {
                return res.status(409).json({
                    message: "An error occurred while updating the inventory assignment. Please try again.",
                });
            }
            res.status(200).json({
                message: "Inventory assignment updated successfully.",
                assignment: updatedAssignment,
            });
        }
        catch (error) {
            console.error("An error occurred while updating inventory assignment:", error);
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error.errors.map((e) => e.message),
                });
            }
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while updating the inventory assignment. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    deleteById: (async (req, res) => {
        try {
            const { id } = req.params;
            const [deletedAssignment] = await connection_1.db
                .delete(index_1.inventoryEmployments)
                .where((0, drizzle_orm_1.eq)(index_1.inventoryEmployments.id, id))
                .returning();
            if (!deletedAssignment) {
                return res.status(404).json({
                    message: `Inventory assignment with associated employee not found with the provided ID "${id}". Please verify the ID.`,
                });
            }
            res.status(200).json({
                message: "Inventory assignment deleted successfully.",
            });
        }
        catch (error) {
            console.error("An error occurred while deleting inventory assignment:", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while deleting the inventory assignment. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
};
