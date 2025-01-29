import { eq, ilike } from "drizzle-orm";
import { db } from "../database/connection";
import { shipments } from "../schemas/index";

export const findShipmentBySid = async (shipmentId: string) => {
  const [shipment] = await db
    .select()
    .from(shipments)
    .where(ilike(shipments.shipment_id, shipmentId))
    .limit(1);

  return shipment ? shipment : null;
};
