import { ilike, desc } from "drizzle-orm";
import { z } from "zod";
import { db } from "../database/connection.js";
import {
  categories,
  insertCategorySchema,
  updateCategorySchema,
} from "../schemas/index.js";
import { findCategoryByName } from "../services/index.js";

export const categoriesController = {
  create: async (req, res) => {
    try {
      await insertCategorySchema.parseAsync(req.body);
      const { name } = req.body;

      const existingCategory = await findCategoryByName(name);
      if (existingCategory) {
        return res.status(409).json({
          message: `The category with the name "${name}" already exists. Please consider a different name.`,
        });
      }

      const [newCategory] = await db
        .insert(categories)
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
    } catch (error) {
      console.error("An error occurred while creating category:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors.map((e) => e.message),
        });
      }
      res.status(500).json({
        message:
          "An unexpected error occurred while creating the category. Please try again.",
        error: error.message,
      });
    }
  },
  retrieveAll: async (req, res) => {
    try {
      const allCategories = await db.query.categories.findMany({
        orderBy: [desc(categories.created_at)],
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
    } catch (error) {
      console.error("An error occurred while retrieving categories:", error);
      res.status(500).json({
        message:
          "An unexpected error occurred while retrieving categories. Please try again.",
        error: error.message,
      });
    }
  },
  retrieveByName: async (req, res) => {
    try {
      const name = req.params.name.replace(/-/g, " ");

      const category = await db.query.categories.findFirst({
        where: ilike(categories.name, name),
        orderBy: [desc(categories.created_at)],
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
    } catch (error) {
      console.error(
        "An error occurred while retrieving category by name:",
        error
      );
      res.status(500).json({
        message:
          "An unexpected error occurred while retrieving the category. Please try again.",
        error: error.message,
      });
    }
  },
  updateByName: async (req, res) => {
    try {
      const name = req.params.name.replace(/-/g, " ");
      await updateCategorySchema.parseAsync(req.body);
      const { name: newName, description } = req.body;

      const existingCategory = await findCategoryByName(name);
      if (!existingCategory) {
        return res.status(404).json({
          message: `The category "${name}" was not found. Please verify the name.`,
        });
      }

      const {
        name: existingCategoryName,
        description: existingCategoryDescription,
      } = existingCategory;

      if (newName && newName !== existingCategoryName) {
        const existingCategory = await findCategoryByName(newName);
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

      const [updatedCategory] = await db
        .update(categories)
        .set(updatedData)
        .where(ilike(categories.name, name))
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
    } catch (error) {
      console.error(
        "An error occurred while updating category by name:",
        error
      );
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors.map((e) => e.message),
        });
      }
      res.status(500).json({
        message:
          "An unexpected error occurred while updating the category. Please try again.",
        error: error.message,
      });
    }
  },
  deleteByName: async (req, res) => {
    try {
      const name = req.params.name.replace(/-/g, " ");

      const [deletedCategory] = await db
        .delete(categories)
        .where(ilike(categories.name, name))
        .returning();
      if (!deletedCategory) {
        return res.status(404).json({
          message: `The category "${name}" was not found. Please verify the name.`,
        });
      }

      res.status(200).json({
        message: `The category "${name}" has been deleted successfully.`,
      });
    } catch (error) {
      console.error(
        "An error occurred while deleting category by name:",
        error
      );
      res.status(500).json({
        message:
          "An unexpected error occurred while deleting the category. Please try again.",
        error: error.message,
      });
    }
  },
};
