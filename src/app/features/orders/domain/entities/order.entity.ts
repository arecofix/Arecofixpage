export type {
  OrderStatus,
  DbOrderStatus,
} from '../value-objects/order-status.vo';

export {
  DB_ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  TERMINAL_ORDER_STATUSES,
  isOrderStatus,
  normalizeOrderStatus,
  getOrderStatusLabel,
} from '../value-objects/order-status.vo';

import type { OrderStatus } from '../value-objects/order-status.vo';

export interface Address {
  street: string;
  number?: string;
  city: string;
  state?: string;
  zip?: string;
  neighborhood?: string;
  floor?: string;
  appartment?: string;
  notes?: string;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id?: string;
  course_id?: string;
  product_name?: string;
  product_sku?: string;
  quantity: number;
  unit_price: number;
  unit_cost_at_time?: number;
  subtotal: number;
  tenant_id?: string;
  created_at?: string;
  product?: any;
}

export type PaymentMethod = 'digital' | 'cash' | 'bank_transfer';

export interface Order {
  id?: string;
  order_number?: string;
  user_id?: string;
  session_id?: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  shipping_address?: Address | string | Record<string, unknown>;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  total_amount?: number;
  payment_method?: PaymentMethod | string;
  payment_ticket_code?: string;
  payment_proof_url?: string;
  notes?: string;
  invoice_url?: string;
  tenant_id?: string;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
  items?: OrderItem[];
  tracking_code?: string;
}
