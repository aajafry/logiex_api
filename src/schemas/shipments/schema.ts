import {
  foreignKey,
  index,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { shipmentStatusEnum } from "../../utils/enum";
import { users, vehicles } from "../index";

export const shipmentStatus = pgEnum(
  "logiex_shipment_status",
  shipmentStatusEnum
);

export const shipments = pgTable(
  "logiex_shipments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    shipment_id: varchar("shipment_id", { length: 20 }).unique().notNull(),
    vehicle_vin: varchar("vehicle_vin", { length: 20 }).notNull(),
    captain_id: uuid("captain_id").notNull(),
    shipment_date: timestamp("shipment_date", { mode: "string" }).defaultNow(),
    status: shipmentStatus("status").default("pending"),
    created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
    updated_at: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      shipment_idIdx: index("shipments_shipment_id_idx").on(table.shipment_id),
      vehicle_vinIdx: index("shipments_vehicle_vin_idx").on(table.vehicle_vin),
      captain_idIdx: index("shipments_captain_id_idx").on(table.captain_id),
      shipmentDateIdx: index("shipments_shipment_date_idx").on(
        table.shipment_date
      ),
      vehicleFk: foreignKey({
        columns: [table.vehicle_vin],
        foreignColumns: [vehicles.vin],
        name: "fk_vehicle",
      })
        .onUpdate("cascade")
        .onDelete("cascade"),
      captainFk: foreignKey({
        columns: [table.captain_id],
        foreignColumns: [users.id],
        name: "fk_captain",
      })
        .onUpdate("cascade")
        .onDelete("cascade"),
    };
  }
);
