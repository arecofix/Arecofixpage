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
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
  role?: 'user' | 'admin' | 'staff';
}
