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
  'delivered',
  'cancelled',
  'refunded',
  'returned',
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
  delivered: 'Entregado',
  cancelled: 'Cancelado',
  refunded: 'Reembolsado',
  returned: 'Devuelto',
};

export const TERMINAL_ORDER_STATUSES: readonly OrderStatus[] = [
  'completed',
  'delivered',
  'cancelled',
  'refunded',
] as const;

/**
 * Valid transitions between order statuses.
 * Enforces strict business lifecycle and prevents invalid jumps.
 */
export const VALID_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  cart: ['pending', 'pending_payment', 'paid', 'cancelled'],
  pending: ['paid', 'cancelled'],
  pending_payment: ['paid', 'cancelled'],
  awaiting_verification: ['paid', 'cancelled'],
  paid: ['preparing', 'shipped', 'cancelled', 'refunded'],
  preparing: ['shipped', 'cancelled'],
  shipped: ['completed', 'delivered', 'returned'],
  completed: ['returned'],
  delivered: ['returned'],
  cancelled: [],
  refunded: [],
  returned: ['refunded'],
};

export function isValidTransition(from: OrderStatus, to: OrderStatus): boolean {
  if (from === to) return true; // Idempotent same-state is allowed
  const validTargets = VALID_TRANSITIONS[from];
  return validTargets ? validTargets.includes(to) : false;
}

export function isOrderStatus(value: string | null | undefined): value is OrderStatus {
  return !!value && (DB_ORDER_STATUSES as readonly string[]).includes(value);
}

export function normalizeOrderStatus(value: string | null | undefined): OrderStatus {
  if (isOrderStatus(value)) return value;
  const legacy: Record<string, OrderStatus> = {
    processing: 'preparing',
    COMPLETADO: 'completed',
    completado: 'completed',
    entregado: 'delivered',
    reembolsado: 'refunded',
  };
  return legacy[value ?? ''] ?? 'pending';
}

export function getOrderStatusLabel(status: string | null | undefined): string {
  const normalized = normalizeOrderStatus(status);
  return ORDER_STATUS_LABELS[normalized] ?? status ?? '';
}
