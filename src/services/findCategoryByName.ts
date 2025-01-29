import { ilike } from "drizzle-orm";
import { db } from "../database/connection";
import { categories, } from "../schemas/index";

export const findCategoryByName = async (name: string) => {
  const [category] = await db
    .select()
    .from(categories)
    .where(ilike(categories.name, name))
    .limit(1);

  return category ? category : null;
};
