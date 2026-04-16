export interface Branch {
  id: string;
  name: string;
  slug: string;
  address: string;
  is_active: boolean;
  global_markup_percentage: number;
  plan_id?: 'basic' | 'premium' | 'custom';
  official_name?: string;
  contact_email?: string;
  contact_phone?: string;
  whatsapp_number?: string;
  bank_info?: {
    alias?: string;
    cbu?: string;
    bank?: string;
  };
  tax_id?: string;
  branding_settings?: {
    logo_url: string | null;
    favicon_url: string | null;
    primary_color: string;
  };
  modules_config?: {
    dashboard: boolean;
    repairs: boolean;
    inventory: boolean;
    customers: boolean;
  };
  tenant_id?: string;
  created_at?: string;
  updated_at?: string;
}
