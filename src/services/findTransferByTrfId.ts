import { ilike } from "drizzle-orm";
import { db } from "../database/connection";
import { transfers } from "../schemas/index";

export const findTransferByTrfId = async (trfId: string, ctx = db) => {
  const [transfer] = await ctx
    .select()
    .from(transfers)
    .where(ilike(transfers.trf_id, trfId))
    .limit(1);

  return transfer ? transfer : null;
};
