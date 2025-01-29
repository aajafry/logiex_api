import { ilike } from "drizzle-orm";
import { db } from "../database/connection";
import { vehicles } from "../schemas/index";

export const findVehicleByChassisNo = async (chassisNo: string) => {
  const [vehicle] = await db
    .select()
    .from(vehicles)
    .where(ilike(vehicles.chassis_no, chassisNo))
    .limit(1);

  return vehicle ? vehicle : null;
};
