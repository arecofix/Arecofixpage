import { Order, OrderItem } from '../../domain/entities/order.entity';
import { normalizeOrderStatus, OrderStatus } from '../../domain/value-objects/order-status.vo';

export interface OrderRow {
  id?: string;
  order_number?: string;
  user_id?: string | null;
  customer_name?: string;
  customer_email?: string | null;
  customer_phone?: string | null;
  shipping_address?: unknown;
  status?: string;
  subtotal?: number;
  tax?: number;
  discount?: number;
  total?: number;
  total_amount?: number;
  payment_method?: string | null;
  payment_proof_url?: string | null;
  notes?: string | null;
  invoice_url?: string | null;
  tenant_id?: string;
  branch_id?: string | null;
  created_at?: string;
  updated_at?: string;
  items?: OrderItem[];
}

export class OrderMapper {
  static toDomain(row: OrderRow): Order {
    return {
      id: row.id,
      order_number: row.order_number,
      user_id: row.user_id ?? undefined,
      customer_name: row.customer_name ?? '',
      customer_email: row.customer_email ?? undefined,
      customer_phone: row.customer_phone ?? undefined,
      shipping_address: row.shipping_address as Order['shipping_address'],
      status: normalizeOrderStatus(row.status),
      subtotal: Number(row.subtotal ?? 0),
      tax: Number(row.tax ?? 0),
      discount: Number(row.discount ?? 0),
      total: Number(row.total ?? row.total_amount ?? 0),
      total_amount: Number(row.total_amount ?? row.total ?? 0),
      payment_method: row.payment_method ?? undefined,
      payment_proof_url: row.payment_proof_url ?? undefined,
      notes: row.notes ?? undefined,
      invoice_url: row.invoice_url ?? undefined,
      tenant_id: row.tenant_id,
      branch_id: row.branch_id ?? undefined,
      created_at: row.created_at,
      updated_at: row.updated_at,
      items: row.items,
    };
  }

  static toPersistence(order: Order): Record<string, unknown> {
    return {
      id: order.id,
      order_number: order.order_number,
      user_id: order.user_id ?? null,
      customer_name: order.customer_name,
      customer_email: order.customer_email ?? null,
      customer_phone: order.customer_phone ?? null,
      shipping_address: order.shipping_address ?? null,
      status: normalizeOrderStatus(order.status) as OrderStatus,
      subtotal: order.subtotal,
      tax: order.tax,
      discount: order.discount,
      total: order.total ?? order.total_amount,
      total_amount: order.total_amount ?? order.total,
      payment_method: order.payment_method ?? null,
      payment_proof_url: order.payment_proof_url ?? null,
      notes: order.notes ?? null,
      invoice_url: order.invoice_url ?? null,
      branch_id: order.branch_id ?? null,
      updated_at: order.updated_at ?? new Date().toISOString(),
    };
  }
}
