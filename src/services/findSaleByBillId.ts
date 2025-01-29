import { ilike } from "drizzle-orm";
import { db } from "../database/connection";
import { sales } from "../schemas/index";

export const findSaleByBillId = async (billId: string) => {
  const sale = await db.query.sales.findFirst({
    where: ilike(sales.bill_id, billId),
    with: {
      products: true,
    },
  });

  return sale ? sale : null;
};
