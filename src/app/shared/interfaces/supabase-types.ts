export interface SupabaseBranchStockRow {
  branch_id: string;
  quantity: number;
  min_stock_alert?: number;
}

export interface SupabaseProductRow {
  id: string;
  name?: string;
  slug?: string;
  price?: number | string;
  currency?: string;
  unit_cost_at_time?: number | string;
  image_url?: string;
  category_id?: string;
  brand_id?: string;
  is_active?: boolean;
  is_featured?: boolean;
  featured?: boolean;
  sku?: string;
  barcode?: string;
  created_at?: string;
  updated_at?: string;
  is_global?: boolean;
  stock?: number | string;
  branch_id?: string;
  description?: string;
  media_metadata?: Record<string, unknown>;
  gallery_urls?: string[];
  branch_stock?: SupabaseBranchStockRow[];
  [key: string]: unknown;
}

export interface SupabaseResponse<T> {
  data: T[] | null;
  error: unknown;
  count?: number | null;
}

export interface SupabaseRepairRow {
  id: string;
  customer_id?: string;
  device_model?: string;
  device_type?: string;
  brand_id?: string;
  imei?: string;
  issue_description?: string;
  current_status_id?: string;
  estimated_cost?: number;
  final_cost?: number;
  technician_notes?: string;
  checklist?: Record<string, unknown>;
  security_pin?: string;
  security_pattern?: string;
  device_passcode?: string;
  deposit_amount?: number;
  tracking_code?: string;
  repair_number?: number;
  technical_labor_cost?: number;
  technical_report?: string;
  upsell_vidrio?: boolean;
  costo_repuesto?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  branch_id?: string;
  tenant_id?: string;
  parts?: Record<string, unknown>[];
  images?: Record<string, unknown>[];
  brand?: Record<string, unknown>;
  [key: string]: unknown;
}
