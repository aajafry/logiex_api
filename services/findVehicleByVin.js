import { eq, ilike } from "drizzle-orm";
import { db } from "../database/connection.js";
import { vehicles } from "../schemas/index.js";

export const findVehicleByVin = async (vin) => {
  const [vehicle] = await db
    .select()
    .from(vehicles)
    .where(ilike(vehicles.vin, vin))
    .limit(1);

  return vehicle ? vehicle : null;
};
