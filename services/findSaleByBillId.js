import { ilike } from "drizzle-orm";
import { db } from "../database/connection.js";
import { sales } from "../schemas/index.js";

export const findSaleByBillId = async (billId) => {
  const sale = await db.query.sales.findFirst({
    where: ilike(sales.bill_id, billId),
    with: {
      products: true,
    },
  });

  return sale ? sale : null;
};
