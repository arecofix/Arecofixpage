import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '@app/services/order.service';
import { Order, OrderWithItems } from '@app/shared/interfaces/order.interface';
import { CommonModule } from '@angular/common';
import { OrderStatusPipe } from '@app/shared/pipes/order-status.pipe';
import { StatusColorPipe } from '@app/shared/pipes/status-color.pipe';
import { LoggerService } from '@app/core/services/logger.service';

@Component({
    selector: 'app-admin-orders-page',
    standalone: true,
    imports: [RouterLink, CommonModule, OrderStatusPipe, StatusColorPipe],
    templateUrl: './admin-orders-page.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminOrdersPage implements OnInit {
    private orderService = inject(OrderService);
    private logger = inject(LoggerService);
    private cdr = inject(ChangeDetectorRef);

    orders: OrderWithItems[] = [];
    loading = true;
    error: string | null = null;

    async ngOnInit() {
        try {
            this.orderService.getOrders().subscribe({
                next: (data) => {
                    this.orders = data as OrderWithItems[];
                    this.loading = false;
                    this.cdr.markForCheck();
                },
                error: (err) => {
                    this.error = err.message || 'Error al cargar pedidos';
                    this.loading = false;
                    this.cdr.markForCheck();
                }
            });
        } catch (e: any) {
            this.error = e.message || 'Error al cargar pedidos';
            this.loading = false;
            this.cdr.markForCheck();
        }
    }

    async toggleOrderStatus(order: OrderWithItems) {
        if (order.status !== 'pending' && order.status !== 'processing') return;

        // processing implies Paid/Abonado in this context
        // pending implies A Pagar
        const newStatus = order.status === 'pending' ? 'processing' : 'pending';
        
        try {
            const { error } = await this.orderService.updateOrderStatus(order.id!, newStatus);
            if (error) throw error;

            // Update local state
            this.orders = this.orders.map(o => 
                o.id === order.id ? { ...o, status: newStatus } : o
            );
            this.cdr.markForCheck();
        } catch (error) {
            this.logger.error('Error updating status:', error);
            alert('Error al actualizar el estado del pedido');
        }
    }
}
