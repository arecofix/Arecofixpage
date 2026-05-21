/**
 * Single source of truth for order lifecycle statuses.
 * DB values match CHECK constraint in supabase/migrations.
 */

/** Values persisted in public.orders.status */
export const DB_ORDER_STATUSES = [
  'cart',
  'pending',
  'pending_payment',
  'awaiting_verification',
  'paid',
  'preparing',
  'shipped',
  'completed',
  'cancelled',
] as const;

export type DbOrderStatus = (typeof DB_ORDER_STATUSES)[number];

/** Application / UI workflow statuses (same set as DB after migration) */
export type OrderStatus = DbOrderStatus;

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  cart: 'Carrito',
  pending: 'Pendiente',
  pending_payment: 'Pago pendiente',
  awaiting_verification: 'Verificando pago',
  paid: 'Pagado',
  preparing: 'En preparación',
  shipped: 'Enviado',
  completed: 'Completado',
  cancelled: 'Cancelado',
};

export const TERMINAL_ORDER_STATUSES: readonly OrderStatus[] = [
  'paid',
  'completed',
  'cancelled',
  'shipped',
  'preparing',
] as const;

export function isOrderStatus(value: string | null | undefined): value is OrderStatus {
  return !!value && (DB_ORDER_STATUSES as readonly string[]).includes(value);
}

export function normalizeOrderStatus(value: string | null | undefined): OrderStatus {
  if (isOrderStatus(value)) return value;
  const legacy: Record<string, OrderStatus> = {
    processing: 'preparing',
    COMPLETADO: 'completed',
    completado: 'completed',
  };
  return legacy[value ?? ''] ?? 'pending';
}

export function getOrderStatusLabel(status: string | null | undefined): string {
  const normalized = normalizeOrderStatus(status);
  return ORDER_STATUS_LABELS[normalized] ?? status ?? '';
}
