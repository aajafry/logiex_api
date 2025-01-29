export interface IShipment {
  id: string;
  shipment_id: string;
  vehicle_vin: string;
  captain_id: string;
  shipment_date: string;
  status: string;
  created_at: string;
  updated_at?: string;
}
