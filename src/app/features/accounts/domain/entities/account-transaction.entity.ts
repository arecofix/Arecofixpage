export interface AccountTransaction {
  id: string;
  tenant_id: string;
  branch_id?: string | null;
  account_id: string;
  type: 'charge' | 'payment' | 'adjustment';
  amount: number;
  reference_type?: 'sale' | 'repair' | 'manual' | 'initial_balance' | null;
  reference_id?: string | null;
  description?: string | null;
  created_by?: string | null;
  created_at: string;
}
