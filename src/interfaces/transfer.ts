export interface ITransfer {
  id: string;
  trf_id: string;
  source_inventory: string;
  destination_inventory: string;
  transfer_date: string;
  created_at: string;
  updated_at?: string;
}
