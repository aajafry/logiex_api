"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const zod_1 = require("zod");
const connection_1 = require("../database/connection");
const index_1 = require("../schemas/index");
const index_2 = require("../services/index");
exports.categoriesController = {
    create: (async (req, res) => {
        try {
            await index_1.insertCategorySchema.parseAsync(req.body);
            const { name } = req.body;
            const existingCategory = await (0, index_2.findCategoryByName)(name);
            if (existingCategory) {
                return res.status(409).json({
                    message: `The category with the name "${name}" already exists. Please consider a different name.`,
                });
            }
            const [newCategory] = await connection_1.db
                .insert(index_1.categories)
                .values({ ...req.body })
                .returning();
            if (!newCategory) {
                return res.status(409).json({
                    message: `An error occurred while creating the category "${name}". Please try again.`,
                });
            }
            res.status(201).json({
                message: `The category "${name}" has been created successfully.`,
                category: newCategory,
            });
        }
        catch (error) {
            console.error("An error occurred while creating category:", error);
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error.errors.map((e) => e.message),
                });
            }
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while creating the category. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    retrieveAll: (async (req, res) => {
        try {
            const allCategories = await connection_1.db.query.categories.findMany({
                orderBy: [(0, drizzle_orm_1.desc)(index_1.categories.created_at)],
                with: {
                    products: {
                        columns: {
                            id: false,
                            category: false,
                            description: false,
                        },
                    },
                },
            });
            res.status(200).json({
                message: "Categories retrieved successfully",
                categories: allCategories,
            });
        }
        catch (error) {
            console.error("An error occurred while retrieving categories:", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while retrieving categories. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    retrieveByName: (async (req, res) => {
        try {
            const name = req.params.name.replace(/-/g, " ");
            const category = await connection_1.db.query.categories.findFirst({
                where: (0, drizzle_orm_1.ilike)(index_1.categories.name, name),
                orderBy: [(0, drizzle_orm_1.desc)(index_1.categories.created_at)],
                with: {
                    products: {
                        columns: {
                            id: false,
                            category: false,
                            description: false,
                        },
                    },
                },
            });
            if (!category) {
                return res.status(404).json({
                    message: `The category "${name}" was not found. Please verify the name and try again.`,
                });
            }
            res.status(200).json({
                message: "Category retrieved successfully",
                category,
            });
        }
        catch (error) {
            console.error("An error occurred while retrieving category by name:", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while retrieving the category. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    updateByName: (async (req, res) => {
        try {
            const name = req.params.name.replace(/-/g, " ");
            await index_1.updateCategorySchema.parseAsync(req.body);
            const { name: newName, description } = req.body;
            const existingCategory = await (0, index_2.findCategoryByName)(name);
            if (!existingCategory) {
                return res.status(404).json({
                    message: `The category "${name}" was not found. Please verify the name.`,
                });
            }
            const { name: existingCategoryName, description: existingCategoryDescription, } = existingCategory;
            if (newName && newName !== existingCategoryName) {
                const existingCategory = await (0, index_2.findCategoryByName)(newName);
                if (existingCategory) {
                    return res.status(409).json({
                        message: `The category with the name "${newName}" already exists. Please choose a different name.`,
                    });
                }
            }
            const updatedData = {
                name: newName || existingCategoryName,
                description: description || existingCategoryDescription,
                updated_at: new Date().toISOString(),
            };
            const [updatedCategory] = await connection_1.db
                .update(index_1.categories)
                .set(updatedData)
                .where((0, drizzle_orm_1.ilike)(index_1.categories.name, name))
                .returning();
            if (!updatedCategory) {
                return res.status(409).json({
                    message: `An error occurred while updating the category "${name}". Please try again.`,
                });
            }
            res.status(200).json({
                message: `The category "${name}" has been updated successfully.`,
                category: updatedCategory,
            });
        }
        catch (error) {
            console.error("An error occurred while updating category by name:", error);
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error.errors.map((e) => e.message),
                });
            }
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while updating the category. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    deleteByName: (async (req, res) => {
        try {
            const name = req.params.name.replace(/-/g, " ");
            const [deletedCategory] = await connection_1.db
                .delete(index_1.categories)
                .where((0, drizzle_orm_1.ilike)(index_1.categories.name, name))
                .returning();
            if (!deletedCategory) {
                return res.status(404).json({
                    message: `The category "${name}" was not found. Please verify the name.`,
                });
            }
            res.status(200).json({
                message: `The category "${name}" has been deleted successfully.`,
            });
        }
        catch (error) {
            console.error("An error occurred while deleting category by name:", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while deleting the category. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
};
