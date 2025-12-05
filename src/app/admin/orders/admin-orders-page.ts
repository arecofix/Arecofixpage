import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '@app/services/order.service';
import { Order } from '@app/shared/interfaces/order.interface';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-admin-orders-page',
    standalone: true,
    imports: [RouterLink, CommonModule],
    templateUrl: './admin-orders-page.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminOrdersPage implements OnInit {
    private orderService = inject(OrderService);
    private cdr = inject(ChangeDetectorRef);

    orders: Order[] = [];
    loading = true;
    error: string | null = null;

    async ngOnInit() {
        try {
            this.orderService.getOrders().subscribe({
                next: (data) => {
                    this.orders = data;
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

    getStatusBadgeClass(status: Order['status']): string {
        const classes: Record<Order['status'], string> = {
            pending: 'badge-warning',
            processing: 'badge-info',
            completed: 'badge-success',
            cancelled: 'badge-error'
        };
        return classes[status] || 'badge-ghost';
    }

    getStatusText(status: Order['status']): string {
        const texts: Record<Order['status'], string> = {
            pending: 'Pendiente',
            processing: 'Procesando',
            completed: 'Completado',
            cancelled: 'Cancelado'
        };
        return texts[status] || status;
    }
}
