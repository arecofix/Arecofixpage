import { Order, OrderItem } from '../../domain/entities/order.entity';
import { normalizeOrderStatus, OrderStatus } from '../../domain/value-objects/order-status.vo';
import { ProductMapper } from '@app/features/products/infrastructure/mappers/product.mapper';

export interface OrderRow {
  id?: string;
  order_number?: string;
  user_id?: string | null;
  session_id?: string | null;
  customer_name?: string | null;
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
  tracking_code?: string | null;
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
      session_id: row.session_id ?? undefined,
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
      tracking_code: row.tracking_code ?? undefined,
      tenant_id: row.tenant_id,
      branch_id: row.branch_id ?? undefined,
      created_at: row.created_at,
      updated_at: row.updated_at,
      items: row.items?.map(item => ({
        ...item,
        cart_item_id: item.cart_item_id || item.id,
        product: item.product ? ProductMapper.mapFromDb(item.product as unknown as Record<string, unknown>) : undefined
      })),
    };
  }

  static toPersistence(order: Order): Record<string, unknown> {
    return {
      id: order.id,
      order_number: order.order_number,
      user_id: order.user_id ?? null,
      session_id: order.session_id ?? null,
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
      tracking_code: order.tracking_code ?? null,
      branch_id: order.branch_id ?? null,
      updated_at: order.updated_at ?? new Date().toISOString(),
    };
  }

  /**
   * Safe Partial Update Mapper for Orders.
   * STRICT GUARANTEE: Never coerces missing/undefined fields to null.
   * Only includes fields explicitly provided with a defined value or explicit null.
   */
  static mapUpdateToDb(dto: Partial<Order>): Record<string, unknown> {
    const payload: Record<string, unknown> = {};

    if (dto.order_number !== undefined) payload['order_number'] = dto.order_number;
    if (dto.user_id !== undefined) payload['user_id'] = dto.user_id;
    if (dto.session_id !== undefined) payload['session_id'] = dto.session_id;
    if (dto.customer_name !== undefined) payload['customer_name'] = dto.customer_name;
    if (dto.customer_email !== undefined) payload['customer_email'] = dto.customer_email;
    if (dto.customer_phone !== undefined) payload['customer_phone'] = dto.customer_phone;
    if (dto.shipping_address !== undefined) payload['shipping_address'] = dto.shipping_address;
    if (dto.status !== undefined) payload['status'] = normalizeOrderStatus(dto.status);
    if (dto.subtotal !== undefined) payload['subtotal'] = dto.subtotal;
    if (dto.tax !== undefined) payload['tax'] = dto.tax;
    if (dto.discount !== undefined) payload['discount'] = dto.discount;
    if (dto.total !== undefined || dto.total_amount !== undefined) {
      payload['total'] = dto.total ?? dto.total_amount;
      payload['total_amount'] = dto.total_amount ?? dto.total;
    }
    if (dto.payment_method !== undefined) payload['payment_method'] = dto.payment_method;
    if (dto.payment_proof_url !== undefined) payload['payment_proof_url'] = dto.payment_proof_url;
    if (dto.notes !== undefined) payload['notes'] = dto.notes;
    if (dto.invoice_url !== undefined) payload['invoice_url'] = dto.invoice_url;
    if (dto.tracking_code !== undefined) payload['tracking_code'] = dto.tracking_code;
    if (dto.branch_id !== undefined) payload['branch_id'] = dto.branch_id;
    if (dto.updated_at !== undefined) payload['updated_at'] = dto.updated_at;

    return payload;
  }
}

