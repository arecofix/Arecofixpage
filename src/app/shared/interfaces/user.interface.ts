export type UserRole = 'super_admin' | 'tenant_owner' | 'technician' | 'staff' | 'user' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  display_name?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  phone?: string | null;
  address?: any | null;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
  role?: UserRole;
  tenant_id?: string;
  branch_id?: string;
}
