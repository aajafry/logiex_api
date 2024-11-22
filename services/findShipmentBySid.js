import { eq, ilike } from "drizzle-orm";
import { db } from "../database/connection.js";
import { shipments } from "../schemas/index.js";

export const findShipmentBySid = async (shipmentId) => {
  const [shipment] = await db
    .select()
    .from(shipments)
    .where(ilike(shipments.shipment_id, shipmentId))
    .limit(1);

  return shipment ? shipment : null;
};
