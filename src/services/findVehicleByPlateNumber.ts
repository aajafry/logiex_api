import { ilike } from "drizzle-orm";
import { db } from "../database/connection";
import { vehicles } from "../schemas/index";

export const findVehicleByPlateNumber = async (plateNumber: string) => {
  const [vehicle] = await db
    .select()
    .from(vehicles)
    .where(ilike(vehicles.plate_number, plateNumber))
    .limit(1);

  return vehicle ? vehicle : null;
};
