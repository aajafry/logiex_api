import { ilike } from "drizzle-orm";
import { db } from "../database/connection.js";
import { vehicles } from "../schemas/index.js";

export const findVehicleByPlateNumber = async (plateNumber) => {
  const [vehicle] = await db
    .select()
    .from(vehicles)
    .where(ilike(vehicles.plate_number, plateNumber))
    .limit(1);

  return vehicle ? vehicle : null;
};
