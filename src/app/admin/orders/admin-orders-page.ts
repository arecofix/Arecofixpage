import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '@app/core/services/order.service';
import { Order, OrderWithItems } from '@app/shared/interfaces/order.interface';
import { CommonModule } from '@angular/common';
import { OrderStatusPipe } from '@app/shared/pipes/order-status.pipe';
import { StatusColorPipe } from '@app/shared/pipes/status-color.pipe';
import { LoggerService } from '@app/core/services/logger.service';
import { Pagination } from '@app/shared/components/pagination/pagination';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-admin-orders-page',
    standalone: true,
    imports: [RouterLink, CommonModule, OrderStatusPipe, StatusColorPipe, Pagination, FormsModule],
    templateUrl: './admin-orders-page.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminOrdersPage implements OnInit {
    private orderService = inject(OrderService);
    private logger = inject(LoggerService);
    private cdr = inject(ChangeDetectorRef);

    // Signals
    orders = signal<OrderWithItems[]>([]);
    loading = signal(true);
    error = signal<string | null>(null);

    // Filters & Sort
    searchQuery = signal('');
    filterStatus = signal<'all' | 'pending' | 'paid' | 'completed' | 'cancelled'>('all');
    sortOrder = signal<'date_desc' | 'date_asc' | 'total_desc'>('date_desc');

    // Pagination
    currentPage = signal(1);
    itemsPerPage = signal(10);

    // Computed: Filtered
    filteredOrders = computed(() => {
        let result = this.orders();
        const query = this.searchQuery().toLowerCase();
        const status = this.filterStatus();

        // 1. Filter Status
        if (status !== 'all') {
            result = result.filter(o => o.status === status);
        }

        // 2. Search
        if (query) {
            result = result.filter(o => 
                o.order_number?.toLowerCase().includes(query) ||
                o.customer_name?.toLowerCase().includes(query) ||
                o.customer_email?.toLowerCase().includes(query)
            );
        }

        // 3. Sort
        const sort = this.sortOrder();
        return result.sort((a, b) => {
            const dateA = new Date(a.created_at || 0).getTime();
            const dateB = new Date(b.created_at || 0).getTime();
            
            switch (sort) {
                case 'date_asc': return dateA - dateB;
                case 'date_desc': return dateB - dateA;
                case 'total_desc': return (b.total || 0) - (a.total || 0);
                default: return 0;
            }
        });
    });

    // Computed: Paginated
    paginatedOrders = computed(() => {
        const all = this.filteredOrders();
        const start = (this.currentPage() - 1) * this.itemsPerPage();
        return all.slice(start, start + this.itemsPerPage());
    });

    // Computed: Total Pages
    totalPages = computed(() => Math.ceil(this.filteredOrders().length / this.itemsPerPage()));

    // Computed: Stats
    stats = computed(() => {
        const all = this.orders();
        return {
            total: all.length,
            pending: all.filter(o => o.status === 'pending').length,
            completed: all.filter(o => o.status === 'completed').length,
            revenue: all.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + (o.total || 0), 0)
        };
    });

    async ngOnInit() {
        this.loadOrders();
    }

    async loadOrders() {
        this.loading.set(true);
        try {
            const data = await firstValueFrom(this.orderService.getOrders());
            this.orders.set(data);
        } catch (err: any) {
            this.error.set(err.message || 'Error al cargar pedidos');
        } finally {
            this.loading.set(false);
            this.cdr.detectChanges();
        }
    }

    async toggleOrderStatus(order: OrderWithItems) {
        if (order.status !== 'pending' && order.status !== 'paid') return;

        const newStatus = order.status === 'pending' ? 'paid' : 'pending';
        
        try {
            const { error } = await this.orderService.updateOrderStatus(order.id!, newStatus);
            if (error) throw error;

            this.orders.update(current => 
                current.map(o => o.id === order.id ? { ...o, status: newStatus } : o)
            );
        } catch (error: any) {
            this.logger.error('Error updating status:', error);
            alert('Error al actualizar el estado del pedido');
        }
    }
    
    updateSort(event: Event) {
        const value = (event.target as HTMLSelectElement).value;
        this.sortOrder.set(value as 'date_desc' | 'date_asc' | 'total_desc');
    }
}
