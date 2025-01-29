export interface IProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  sku: string;
  created_at: string;
  updated_at?: string;
}
