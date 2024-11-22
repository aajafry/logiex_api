import { ilike } from "drizzle-orm";
import { db } from "../database/connection.js";
import { vehicles } from "../schemas/index.js";

export const findVehicleByChassisNo = async (chassisNo) => {
  const [vehicle] = await db
    .select()
    .from(vehicles)
    .where(ilike(vehicles.chassis_no, chassisNo))
    .limit(1);

  return vehicle ? vehicle : null;
};
