import { desc, ilike } from "drizzle-orm";
import { Request, Response, RequestHandler } from "express";
import { z } from "zod";
import { db } from "../database/connection";
import {
  insertProductSchema,
  products,
  updateProductSchema,
} from "../schemas/index";
import { findProductByName, findProductBySKU } from "../services/index";

export const productsController = {
  create: (async (req: Request, res: Response) => {
    try {
      await insertProductSchema.parseAsync(req.body);
      const { name, sku } = req.body;
      let existingProduct;

      existingProduct = await findProductByName(name);
      if (existingProduct) {
        return res.status(409).json({
          message: `The product with the name "${name}" already exists. Please consider a different name.`,
        });
      }

      existingProduct = await findProductBySKU(sku);
      if (existingProduct) {
        return res.status(409).json({
          message: `The product with the SKU "${sku}" already exists. Please consider a different SKU.`,
        });
      }

      const [newProduct] = await db
        .insert(products)
        .values({ ...req.body })
        .returning();
      if (!newProduct) {
        return res.status(409).json({
          message: `An error occurred while creating the product "${name}". Please try again.`,
        });
      }

      res.status(201).json({
        message: `The product "${name}" has been created successfully`,
        product: newProduct,
      });
    } catch (error) {
      console.error("An error occurred while creating product", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors.map((e) => e.message),
        });
      }

      if (error instanceof Error) {
        res.status(500).json({
          message:
            "An unexpected error occurred while creating the product. Please try again.",
          error: error.message,
        });
      }
    }
  }) as RequestHandler,
  retrieveAll: (async (req: Request, res: Response) => {
    try {
      const allProducts = await db.query.products.findMany({
        orderBy: [desc(products.created_at)],
        with: {
          category: false,
          purchases: {
            columns: {
              id: false,
            },
          },
          sales: {
            columns: {
              id: false,
            },
          },
          transfers: {
            columns: {
              id: false,
            },
          },
          inventories: {
            columns: {
              id: false,
            },
          },
        },
      });
      res.status(200).json({
        message: "Products retrieved successfully",
        products: allProducts,
      });
    } catch (error) {
      console.error("An error occurred while retrieving products", error);

      if (error instanceof Error) {
        res.status(500).json({
          message:
            "An unexpected error occurred while retrieving products. Please try again.",
          error: error.message,
        });
      }
    }
  }) as RequestHandler,
  retrieveByName: (async (req: Request, res: Response) => {
    try {
      const name = req.params.name.replace(/-/g, " ");

      const product = await db.query.products.findFirst({
        where: ilike(products.name, name),
        orderBy: [desc(products.created_at)],
        with: {
          category: false,
          purchases: {
            columns: {
              id: false,
            },
          },
          sales: {
            columns: {
              id: false,
            },
          },
          transfers: {
            columns: {
              id: false,
            },
          },
          inventories: {
            columns: {
              id: false,
            },
          },
        },
      });
      if (!product) {
        return res.status(404).json({
          message: `The product "${name}" was not found. Please verify the name and try again.`,
        });
      }
      res.status(200).json({
        message: "Product retrieved successfully",
        product,
      });
    } catch (error) {
      console.error(
        "An error occurred while retrieving product by name",
        error
      );

      if (error instanceof Error) {
        res.status(500).json({
          message:
            "An unexpected error occurred while retrieving the product. Please try again.",
          error: error.message,
        });
      }
    }
  }) as RequestHandler,
  updateByName: (async (req: Request, res: Response) => {
    try {
      await updateProductSchema.parseAsync(req.body);
      const name = req.params.name.replace(/-/g, " ");
      const { name: newName, description, price, category, sku } = req.body;

      const existingProduct = await findProductByName(name);
      if (!existingProduct) {
        return res.status(404).json({
          message: `The product with the provided name "${name}" was not found. Please verify the name.`,
        });
      }

      const {
        name: existingProductName,
        description: existingProductDescription,
        price: existingProductPrice,
        category: existingProductCategory,
        sku: existingProductSku,
      } = existingProduct;

      if (newName && newName !== existingProductName) {
        const existingProduct = await findProductByName(newName);
        if (existingProduct) {
          return res.status(409).json({
            message: `The product with the name "${newName}" already exists. Please consider a different name.`,
          });
        }
      }

      if (sku && sku !== existingProductSku) {
        const existingProduct = await findProductBySKU(sku);
        if (existingProduct) {
          return res.status(409).json({
            message: `The product with the SKU "${sku}" already exists. Please consider a different SKU.`,
          });
        }
      }

      const updatedData = {
        name: newName || existingProductName,
        description: description || existingProductDescription,
        price: price || existingProductPrice,
        category: category || existingProductCategory,
        sku: sku || existingProductSku,
        updated_at: new Date().toISOString(),
      };

      const [updatedProduct] = await db
        .update(products)
        .set(updatedData)
        .where(ilike(products.name, name))
        .returning();

      if (!updatedProduct) {
        return res.status(409).json({
          message: `An error occurred while updating the Product "${name}". Please try again.`,
        });
      }

      res.status(200).json({
        message: `The product "${name}" has been updated successfully`,
        product: updatedProduct,
      });
    } catch (error) {
      console.error("An error occurred while updating product", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors.map((e) => e.message),
        });
      }

      if (error instanceof Error) {
        res.status(500).json({
          message:
            "An unexpected error occurred while updating the product. Please try again.",
          error: error.message,
        });
      }
    }
  }) as RequestHandler,
  deleteByName: (async (req: Request, res: Response) => {
    try {
      const name = req.params.name.replace(/-/g, " ");

      const [deletedProduct] = await db
        .delete(products)
        .where(ilike(products.name, name))
        .returning();

      if (!deletedProduct) {
        return res.status(404).json({
          message: `The product "${name}" was not found. Please verify the name and try again.`,
        });
      }

      res.status(200).json({
        message: `The product "${name}" has been deleted successfully`,
      });
    } catch (error) {
      console.error("An error occurred while deleting product by name", error);

      if (error instanceof Error) {
        res.status(500).json({
          message:
            "An unexpected error occurred while deleting the product. Please try again.",
          error: error.message,
        });
      }
    }
  }) as RequestHandler,
};
