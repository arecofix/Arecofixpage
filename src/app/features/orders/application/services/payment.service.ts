import { Injectable, inject, signal } from '@angular/core';
import { OrderService } from './order.service';
import { SupabaseStorageService } from '@app/core/services/supabase-storage.service';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { OrderStatus } from '../../domain/entities/order.entity';
import { interval, Subscription, firstValueFrom } from 'rxjs';

export interface PaymentTicket {
  orderId: string;
  orderNumber: string;
  total: number;
  ticketCode: string;
  expiresAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private orderService    = inject(OrderService);
  private storageService  = inject(SupabaseStorageService);
  private supabase        = inject(SUPABASE_CLIENT);

  /** Signals for reactive UI updates */
  orderStatus = signal<OrderStatus | null>(null);
  isUploadingProof = signal(false);
  proofUploadUrl = signal<string | null>(null);

  private pollingSubscription: Subscription | null = null;

  /**
   * Generates a unique barcode-style ticket code for cash payment.
   */
  generateTicketCode(orderNumber: string): string {
    const base = orderNumber.replace('ORD-', '');
    const random = Math.floor(Math.random() * 9000 + 1000);
    const timestamp = Date.now().toString().slice(-6);
    return `AF${base}${random}${timestamp}`.toUpperCase();
  }

  /**
   * Creates a payment ticket payload for display.
   */
  buildPaymentTicket(orderId: string, orderNumber: string, total: number): PaymentTicket {
    const ticketCode = this.generateTicketCode(orderNumber);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h to pay
    return { orderId, orderNumber, total, ticketCode, expiresAt };
  }

  /**
   * Uploads a payment proof file to Supabase Storage and updates order status.
   */
  async uploadPaymentProof(orderId: string, file: File): Promise<string> {
    this.isUploadingProof.set(true);
    try {
      const url = await this.storageService.uploadFile(
        file,
        'payment-proofs',
        'public-assets',
        { context: 'PaymentProof' }
      );
      this.proofUploadUrl.set(url);

      // Transition order to AWAITING_VERIFICATION + save proof URL in one patch
      await this.supabase
        .from('orders')
        .update({
          status: 'awaiting_verification',
          payment_proof_url: url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      // Also update the reactive status signal
      this.orderStatus.set('awaiting_verification');

      return url;
    } finally {
      this.isUploadingProof.set(false);
    }
  }

  /**
   * Starts polling Supabase every N seconds to check if an order has been PAID.
   * Stops automatically once PAID or CANCELLED/COMPLETED is detected.
   */
  startPolling(orderId: string, intervalMs: number = 15000): void {
    this.stopPolling();
    this.pollingSubscription = interval(intervalMs).subscribe(async () => {
      try {
        const order = await firstValueFrom(this.orderService.getOrderById(orderId));
        if (order) {
          this.orderStatus.set(order.status);
          const terminalStates: OrderStatus[] = ['paid', 'completed', 'cancelled', 'shipped', 'preparing'];
          if (terminalStates.includes(order.status)) {
            this.stopPolling();
          }
        }
      } catch (_) {
        // Silently absorb polling errors to avoid UI disruption
      }
    });
  }

  stopPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = null;
    }
  }
}
