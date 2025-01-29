import { ilike } from "drizzle-orm";
import { db } from "../database/connection";
import { vehicles } from "../schemas/index";

export const findVehicleByEngineNo = async (engineNo: string) => {
  const [vehicle] = await db
    .select()
    .from(vehicles)
    .where(ilike(vehicles.engine_no, engineNo))
    .limit(1);

  return vehicle ? vehicle : null;
};
