import { ilike } from "drizzle-orm";
import { db } from "../database/connection.js";
import { purchases } from "../schemas/index.js";

export const findPurchaseByMrId = async (mrId) => {
  const [purchase] = await db
    .select()
    .from(purchases)
    .where(ilike(purchases.mr_id, mrId))
    .limit(1);

  return purchase ? purchase : null;
};
