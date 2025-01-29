"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorsController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const zod_1 = require("zod");
const connection_1 = require("../database/connection");
const index_1 = require("../schemas/index");
const index_2 = require("../services/index");
exports.vendorsController = {
    create: (async (req, res) => {
        try {
            await index_1.insertVendorSchema.parseAsync(req.body);
            const { name, email, phone, address } = req.body;
            if (name) {
                const existingVendor = await (0, index_2.findVendorByName)(name);
                if (existingVendor) {
                    return res.status(409).json({
                        message: `The vendor with the name "${name}" already exists. Please use a different name.`,
                    });
                }
            }
            if (email) {
                const existingVendor = await (0, index_2.findVendorByEmail)(email);
                if (existingVendor) {
                    return res.status(409).json({
                        message: `The vendor with the email "${email}" already exists. Please use a different email.`,
                    });
                }
            }
            if (phone) {
                const existingVendor = await (0, index_2.findVendorByPhone)(phone);
                if (existingVendor) {
                    return res.status(409).json({
                        message: `The vendor with the phone number "${phone}" already exists. Please use a different phone number.`,
                    });
                }
            }
            const [newVendor] = await connection_1.db
                .insert(index_1.vendors)
                .values({ ...req.body })
                .returning();
            if (!newVendor) {
                return res.status(409).json({
                    message: `An error occurred while creating the vendor "${name}". Please try again.`,
                });
            }
            res.status(201).json({
                message: `The vendor "${name}" has been created successfully`,
                vendor: newVendor,
            });
        }
        catch (error) {
            console.error("An error occurred while creating vendor:", error);
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error.errors.map((e) => e.message),
                });
            }
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while creating the vendor. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    retrieveAll: (async (req, res) => {
        try {
            const allVendors = await connection_1.db.query.vendors.findMany({
                orderBy: [(0, drizzle_orm_1.desc)(index_1.vendors.created_at)],
                with: {
                    sales: {
                        columns: {
                            id: false,
                        },
                    },
                },
            });
            res.status(200).json({
                message: "Vendors retrieved successfully",
                vendors: allVendors,
            });
        }
        catch (error) {
            console.error("An error occurred while retrieving vendors:", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while retrieving vendors. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    retrieveByName: (async (req, res) => {
        try {
            const name = req.params.name.replace(/-/g, " ");
            const vendor = await connection_1.db.query.vendors.findFirst({
                where: (0, drizzle_orm_1.ilike)(index_1.vendors.name, name),
                orderBy: [(0, drizzle_orm_1.desc)(index_1.vendors.created_at)],
                with: {
                    sales: {
                        columns: {
                            id: false,
                        },
                    },
                },
            });
            if (!vendor) {
                return res.status(404).json({
                    message: `The vendor "${name}" was not found. Please verify the name.`,
                });
            }
            res.status(200).json({
                message: "Vendor retrieved successfully",
                vendor,
            });
        }
        catch (error) {
            console.error("An error occurred while retrieving vendor by ID:", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while retrieving the vendor. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    updateByName: (async (req, res) => {
        try {
            await index_1.updateVendorSchema.parseAsync(req.body);
            const name = req.params.name.replace(/-/g, " ");
            const { name: newName, email, phone, address } = req.body;
            const existingVendor = await (0, index_2.findVendorByName)(name);
            if (!existingVendor) {
                return res.status(404).json({
                    message: `The vendor "${name}" was not found. Please verify the name.`,
                });
            }
            const { name: existingVendorName, email: existingVendorEmail, phone: existingVendorPhone, address: existingVendorAddress, } = existingVendor;
            if (newName && newName !== existingVendorName) {
                const [existingVendor] = await (0, index_2.findVendorByName)(newName);
                if (existingVendor) {
                    return res.status(409).json({
                        message: `The vendor with the provided name "${newName}" already exists. Please use a different name.`,
                    });
                }
            }
            if (email && email !== existingVendorEmail) {
                const existingVendor = await (0, index_2.findVendorByEmail)(email);
                if (existingVendor) {
                    return res.status(409).json({
                        message: `The vendor with the provided email "${email}" already exists. Please use a different email.`,
                    });
                }
            }
            if (phone && phone !== existingVendorPhone) {
                const existingVendor = await (0, index_2.findVendorByPhone)(phone);
                if (existingVendor) {
                    return res.status(409).json({
                        message: `The vendor with the provided phone number "${phone}" already exists. Please use a different phone number.`,
                    });
                }
            }
            const updatedData = {
                name: newName || existingVendorName,
                email: email || existingVendorEmail,
                phone: phone || existingVendorPhone,
                address: address || existingVendorAddress,
                updated_at: new Date().toISOString(),
            };
            const [updatedVendor] = await connection_1.db
                .update(index_1.vendors)
                .set(updatedData)
                .where((0, drizzle_orm_1.ilike)(index_1.vendors.name, name))
                .returning();
            if (!updatedVendor) {
                return res.status(409).json({
                    message: `An error occurred while updating the vendor "${name}". Please try again.`,
                });
            }
            res.status(200).json({
                message: `The vendor "${name}" has been updated successfully`,
                vendor: updatedVendor,
            });
        }
        catch (error) {
            console.error("An error occurred while creating vendor:", error);
            if (error instanceof zod_1.z.ZodError) {
                res.status(400).json({
                    message: "Validation error",
                    errors: error.errors.map((e) => e.message),
                });
            }
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while updating the vendor. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    deleteByName: (async (req, res) => {
        try {
            const name = req.params.name.replace(/-/g, " ");
            const [deletedVendor] = await connection_1.db
                .delete(index_1.vendors)
                .where((0, drizzle_orm_1.ilike)(index_1.vendors.name, name))
                .returning();
            if (!deletedVendor) {
                return res.status(404).json({
                    message: `The vendor "${name}" was not found. Please verify the name.`,
                });
            }
            res.status(200).json({
                message: `The vendor "${name}" has been deleted successfully`,
            });
        }
        catch (error) {
            console.error("An error occurred while deleting vendor by ID:", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while deleting the vendor. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
};
