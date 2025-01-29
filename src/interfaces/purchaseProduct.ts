export interface IPurchaseProduct {
  // id: string;
  mr_id: string;
  product: string;
  quantity: number;
  unit_price: number;
  discount?: number;
  total_price: string; // it should be a number
  // created_at: string;
  // updated_at?: string;
}
