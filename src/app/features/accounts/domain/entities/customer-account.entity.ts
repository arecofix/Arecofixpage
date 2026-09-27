export interface CustomerAccount {
  id: string;
  tenant_id: string;
  branch_id?: string | null;
  customer_id: string;
  balance: number;
  credit_limit: number;
  status: 'active' | 'suspended';
  created_at: string;
  updated_at: string;
  
  // Optional relations
  customer?: any; // Replace with proper Customer entity if imported
}
