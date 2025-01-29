
export interface IVehicle {
  id: string;
  make: string;
  model?: string;
  year: number;
  color: string;
  mileage?: number;
  engine_no?: string;
  chassis_no?: string;
  vin: string;
  plate_number: string;
  cargo_capacity: number;
  type: string;
  created_at: string;
  updated_at?: string;
}