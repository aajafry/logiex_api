import { ilike } from "drizzle-orm";
import { db } from "../database/connection.js";
import { vehicles } from "../schemas/index.js";

export const findVehicleByEngineNo = async (engineNo) => {
  const [vehicle] = await db
    .select()
    .from(vehicles)
    .where(ilike(vehicles.engine_no, engineNo))
    .limit(1);

  return vehicle ? vehicle : null;
};
