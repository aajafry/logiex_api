import { ilike } from "drizzle-orm";
import { db } from "../database/connection.js";
import { categories, } from "../schemas/index.js";

export const findCategoryByName = async (name) => {
  const [category] = await db
    .select()
    .from(categories)
    .where(ilike(categories.name, name))
    .limit(1);

  return category ? category : null;
};
