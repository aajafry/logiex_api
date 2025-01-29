import { eq, ilike } from "drizzle-orm";
import { db } from "../database/connection";
import { vehicles } from "../schemas/index";

export const findVehicleByVin = async (vin: string) => {
  const [vehicle] = await db
    .select()
    .from(vehicles)
    .where(ilike(vehicles.vin, vin))
    .limit(1);

  return vehicle ? vehicle : null;
};
