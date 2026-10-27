import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  OnDestroy,
  signal,
  computed,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '@app/features/orders/application/services/order.service';
import { Order, OrderStatus } from '@app/features/orders/domain/entities/order.entity';
import { CommonModule } from '@angular/common';
import { OrderStatusPipe } from '@app/shared/pipes/order-status.pipe';
import { StatusColorPipe } from '@app/shared/pipes/status-color.pipe';
import { LoggerService } from '@app/core/services/logger.service';
import { NotificationService } from '@app/core/services/notification.service';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ScrollingModule } from '@angular/cdk/scrolling';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { TenantService } from '@app/core/services/tenant.service';

@Component({
  selector: 'app-admin-orders-page',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    OrderStatusPipe,
    StatusColorPipe,
    FormsModule,
    ScrollingModule,
  ],
  templateUrl: './admin-orders-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminOrdersPage implements OnInit, OnDestroy {
  private orderService = inject(OrderService);
  private logger = inject(LoggerService);
  private cdr = inject(ChangeDetectorRef);
  private notificationService = inject(NotificationService);
  private supabase = inject(SUPABASE_CLIENT);
  private tenantService = inject(TenantService);

  private realtimeChannel: RealtimeChannel | null = null;

  // Signals
  orders = signal<Order[]>([]);
  loading = signal(true);
  updatingStatus = signal<string | null>(null);
  error = signal<string | null>(null);

  // Filters & Sort
  searchQuery = signal('');
  filterStatus = signal<OrderStatus | 'all'>('all');
  sortOrder = signal<'date_desc' | 'date_asc' | 'total_desc'>('date_desc');

  // Interactive Modals State
  selectedOrderForDetail = signal<Order | null>(null);
  orderToShip = signal<Order | null>(null);
  trackingCodeInput = signal<string>('');
  orderToCancel = signal<Order | null>(null);
  cancellationReason = signal<string>('');

  // Computed: Filtered
  filteredOrders = computed(() => {
    let result = this.orders();
    const query = this.searchQuery().toLowerCase().trim();
    const status = this.filterStatus();

    // 1. Filter Status
    if (status !== 'all') {
      result = result.filter((o) => o.status === status);
    }

    // 2. Search
    if (query) {
      result = result.filter(
        (o) =>
          o.order_number?.toLowerCase().includes(query) ||
          o.customer_name?.toLowerCase().includes(query) ||
          o.customer_email?.toLowerCase().includes(query) ||
          o.customer_phone?.toLowerCase().includes(query) ||
          o.id?.toLowerCase().includes(query),
      );
    }

    // 3. Sort
    const sort = this.sortOrder();
    return result.sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();

      switch (sort) {
        case 'date_asc':
          return dateA - dateB;
        case 'date_desc':
          return dateB - dateA;
        case 'total_desc':
          return (b.total || 0) - (a.total || 0);
        default:
          return 0;
      }
    });
  });

  // Computed: Stats
  stats = computed(() => {
    const all = this.orders();
    return {
      total: all.length,
      pending: all.filter(
        (o) =>
          o.status === 'pending' ||
          o.status === 'pending_payment' ||
          o.status === 'awaiting_verification',
      ).length,
      paid: all.filter((o) => o.status === 'paid' || o.status === 'preparing').length,
      shipped: all.filter((o) => o.status === 'shipped').length,
      completed: all.filter((o) => o.status === 'completed' || o.status === 'delivered').length,
      revenue: all
        .filter((o) => o.status !== 'cancelled' && o.status !== 'refunded')
        .reduce((sum, o) => sum + (o.total || 0), 0),
    };
  });

  async ngOnInit() {
    await this.loadOrders();
    this.initRealtimeSubscription();
  }

  ngOnDestroy() {
    if (this.realtimeChannel) {
      this.supabase.removeChannel(this.realtimeChannel);
      this.realtimeChannel = null;
    }
  }

  private initRealtimeSubscription() {
    try {
      const currentTenantId = this.tenantService.getTenantId();
      this.realtimeChannel = this.supabase
        .channel(`admin-orders-realtime:${currentTenantId}`)
        .on(
          'postgres_changes',
          { 
            event: '*', 
            schema: 'public', 
            table: 'orders',
            filter: `tenant_id=eq.${currentTenantId}`
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              const newOrder = payload.new as Order;
              if (newOrder.tenant_id !== currentTenantId) return;
              this.notificationService.showInfo(
                `¡Nuevo pedido recibido! #${newOrder.order_number || (newOrder.id ? newOrder.id.substring(0, 8) : '')}`,
              );
              this.orders.update((current) => {
                if (current.some((o) => o.id === newOrder.id)) return current;
                return [newOrder, ...current];
              });
              this.cdr.detectChanges();
            } else if (payload.eventType === 'UPDATE') {
              const updated = payload.new as Order;
              if (updated.tenant_id !== currentTenantId) return;
              this.orders.update((current) =>
                current.map((o) => (o.id === updated.id ? { ...o, ...updated } : o)),
              );
              this.cdr.detectChanges();
            }
          },
        )
        .subscribe();
    } catch (e) {
      this.logger.warn('[AdminOrdersPage] Could not setup Realtime listener:', e);
    }
  }

  async loadOrders() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const data = await firstValueFrom(this.orderService.getOrders());
      this.orders.set(data || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar pedidos';
      this.error.set(msg);
      this.logger.error('Error loading orders:', err);
    } finally {
      this.loading.set(false);
      this.cdr.detectChanges();
    }
  }

  async transitionStatus(
    order: Order,
    newStatus: OrderStatus,
    trackingCode?: string,
    reason?: string,
  ) {
    if (!order.id) return;

    // Idempotency guard: prevent duplicate concurrent clicks
    if (this.updatingStatus() === order.id) {
      return;
    }

    if (order.status === newStatus) {
      return;
    }

    this.updatingStatus.set(order.id);
    const previousStatus = order.status;

    // 1. Optimistic Update (immediate UI feedback)
    this.orders.update((current) =>
      current.map((o) =>
        o.id === order.id
          ? { ...o, status: newStatus, ...(trackingCode ? { tracking_code: trackingCode } : {}) }
          : o,
      ),
    );

    try {
      // 2. Server call via Domain Service (which runs state machine & emits events)
      const updatedOrder = await this.orderService.transitionOrderStatus(
        order.id,
        newStatus,
        trackingCode,
        reason,
      );

      this.orders.update((current) =>
        current.map((o) => (o.id === order.id ? { ...o, ...updatedOrder } : o)),
      );

      this.notificationService.showSuccess(
        `Pedido #${order.order_number} actualizado a "${newStatus}"`,
      );
    } catch (error: unknown) {
      // 3. Rollback on failure
      const errorMsg = error instanceof Error ? error.message : 'Error al actualizar pedido';
      this.logger.error('Error transitioning order status, rolling back...', error);

      this.orders.update((current) =>
        current.map((o) => (o.id === order.id ? { ...o, status: previousStatus } : o)),
      );

      this.notificationService.showError(errorMsg);
    } finally {
      this.updatingStatus.set(null);
      this.cdr.detectChanges();
    }
  }

  // Action Helpers
  async markAsPaid(order: Order) {
    await this.transitionStatus(order, 'paid');
  }

  openShipModal(order: Order, event?: Event) {
    if (event) event.stopPropagation();
    this.orderToShip.set(order);
    this.trackingCodeInput.set(order.tracking_code || '');
  }

  closeShipModal() {
    this.orderToShip.set(null);
    this.trackingCodeInput.set('');
  }

  async confirmShip(trackingValue?: string) {
    const order = this.orderToShip();
    if (!order) return;
    const tracking = (trackingValue ?? this.trackingCodeInput()).trim();
    this.closeShipModal();
    await this.transitionStatus(order, 'shipped', tracking || undefined);
  }

  async markAsDelivered(order: Order) {
    await this.transitionStatus(order, 'completed');
  }

  openCancelModal(order: Order, event?: Event) {
    if (event) event.stopPropagation();
    this.orderToCancel.set(order);
    this.cancellationReason.set('');
  }

  closeCancelModal() {
    this.orderToCancel.set(null);
    this.cancellationReason.set('');
  }

  async confirmCancel(reasonValue?: string) {
    const order = this.orderToCancel();
    if (!order) return;
    const reason = (reasonValue ?? this.cancellationReason()).trim() || 'Cancelado por el administrador';
    this.closeCancelModal();
    await this.transitionStatus(order, 'cancelled', undefined, reason);
  }


  async markAsRefunded(order: Order) {
    await this.transitionStatus(order, 'refunded');
  }

  // Quick Detail Modal
  openDetail(order: Order, event?: Event) {
    if (event) event.stopPropagation();
    this.selectedOrderForDetail.set(order);
  }

  closeDetail() {
    this.selectedOrderForDetail.set(null);
  }

  updateSort(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.sortOrder.set(value as 'date_desc' | 'date_asc' | 'total_desc');
  }

  trackById(index: number, item: Order): string {
    return item.id || String(index);
  }
}
