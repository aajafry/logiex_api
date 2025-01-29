export interface IInventoryEmployment {
  id: string;
  employee_id: string;
  inventory: string;
  hire_date: string;
  termination_date?: string;
  resign_date?: string;
  transfer_date?: string;
  employee_status: boolean;
  created_at: string;
  updated_at?: string;
}
