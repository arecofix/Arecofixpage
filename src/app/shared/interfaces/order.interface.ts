import type { OrderStatus } from '@app/features/orders/domain/value-objects/order-status.vo';

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id?: string;
  course_id?: string;
  product_name?: string;
  product_sku?: string;
  quantity: number;
  unit_price: number;
  cost_price?: number;
  subtotal: number;
  tenant_id?: string;
  product?: unknown;
}

export interface Address {
  street?: string;
  number?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  additional_info?: string;
}

export interface Order {
  id?: string;
  order_number?: string;
  user_id?: string;
  session_id?: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  shipping_address?: Address;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  total_amount?: number;
  payment_method?: string;
  payment_proof_url?: string;
  invoice_url?: string;
  notes?: string;
  tenant_id?: string;
  branch_id?: string;
  items?: OrderItem[];
}
