import { ilike } from "drizzle-orm";
import { db } from "../database/connection.js";
import { transfers } from "../schemas/index.js";

export const findTransferByTrfId = async (trfId, ctx = db) => {
  const [transfer] = await ctx
    .select()
    .from(transfers)
    .where(ilike(transfers.trf_id, trfId))
    .limit(1);

  return transfer ? transfer : null;
};
