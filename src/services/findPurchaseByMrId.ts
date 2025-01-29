import { ilike } from "drizzle-orm";
import { db } from "../database/connection";
import { purchases } from "../schemas/index";

export const findPurchaseByMrId = async (mrId: string) => {
  const [purchase] = await db
    .select()
    .from(purchases)
    .where(ilike(purchases.mr_id, mrId))
    .limit(1);

  return purchase ? purchase : null;
};
