export interface CustomerDevice {
  id: string;
  user_id?: string | null;
  model_id?: string | null;
  serial_number?: string | null;
  imei?: string | null;
  passcode?: string | null;
  notes?: string | null;
  created_at?: string;
  tenant_id?: string;
  deleted_at?: string | null;
  updated_at?: string;
  type?: string | null;
}

export interface DeviceModel {
  id: string;
  name: string;
  slug: string;
  brand_id?: string | null;
  tenant_id?: string;
}
