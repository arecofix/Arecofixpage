import { Component, inject, OnInit, signal, computed, effect, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { OrderService } from '@app/features/orders/application/services/order.service';
import { InvoiceService } from '@app/features/sales/application/invoice.service';
import { Product } from '@app/features/products/domain/entities/product.entity';
import { ProductRepository } from '@app/features/products/domain/repositories/product.repository';
import { LoggerService } from '@app/core/services/logger.service';
import { Order, OrderItem } from '@app/features/orders/domain/entities/order.entity';
import { Pagination } from '@app/shared/components/pagination/pagination';
import { FinanceService } from '@app/features/finance/application/services/finance.service';
import { TenantService } from '@app/core/services/tenant.service';
import { NotificationService } from '@app/core/services/notification.service';
import { BranchContextService } from '@app/core/services/branch-context.service';

interface CartItem extends Product {
    quantity: number;
}

@Component({
    selector: 'app-admin-sales-page',
    standalone: true,
    imports: [CommonModule, FormsModule, Pagination],
    templateUrl: './admin-sales-page.html',
})
export class AdminSalesPage implements OnInit {
    private router = inject(Router);
    private logger = inject(LoggerService);
    private productRepository = inject(ProductRepository);
    private orderService = inject(OrderService);
    private invoiceService = inject(InvoiceService);
    private financeService = inject(FinanceService);
    public tenantService = inject(TenantService);
    private notificationService = inject(NotificationService);

    private branchContextService = inject(BranchContextService);

    // Data Signals
    products = signal<Product[]>([]);
    cart = signal<CartItem[]>([]);
    
    // UI State Signals
    searchQuery = signal('');
    loading = signal(false);
    processing = signal(false);
    isCartOpenMobile = signal(false); // For mobile responsiveness
    customerName = signal('');
    discount = signal<number>(0);
    paymentMethod = signal<'efectivo' | 'transferencia' | 'tarjeta'>('efectivo');

    // Pagination Signals
    currentPage = signal(1);
    itemsPerPage = signal(12);

    // Computed: Filtered Products
    filteredProducts = computed(() => {
        const query = this.searchQuery().toLowerCase();
        return this.products().filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.sku?.toLowerCase().includes(query) ||
            p.barcode?.toLowerCase().includes(query)
        );
    });

    // ... (paginatedProducts, totalPages remain same)
    paginatedProducts = computed(() => {
        const all = this.filteredProducts();
        const start = (this.currentPage() - 1) * this.itemsPerPage();
        return all.slice(start, start + this.itemsPerPage());
    });

    totalPages = computed(() => Math.ceil(this.filteredProducts().length / this.itemsPerPage()));

    cartSubtotal = computed(() => {
        const rate = this.tenantService.currentTenant()?.usd_rate || 1;
        return this.cart().reduce((acc, item) => {
            const price = item.currency === 'USD' ? (item.price * rate) : item.price;
            return acc + (price * item.quantity);
        }, 0);
    });
    finalTotal = computed(() => Math.max(0, this.cartSubtotal() - (this.discount() || 0)));
    cartCount = computed(() => this.cart().reduce((acc, item) => acc + item.quantity, 0));

    constructor() {
        // Reset pagination on search
        effect(() => {
            this.searchQuery();
        });

        // RE-LOAD products on branch change!
        effect(() => {
            this.branchContextService.getBranchId();
            untracked(() => this.loadProducts());
        });
    }

    private route = inject(ActivatedRoute);

    async ngOnInit() {
        this.route.queryParams.subscribe((params: any) => {
            const page = params['_page'] ? parseInt(params['_page'], 10) : 1;
            this.currentPage.set(page || 1);
        });
    }

    async loadProducts() {
        this.loading.set(true);
        const branch_id = this.branchContextService.getBranchId() || undefined;

        // Use any to bypass strict ProductsParams check if interface hasn't updated in memory
        this.productRepository.findWithFilters({ 
            branch_id, 
            is_paginated: false 
        } as any).subscribe({
            next: (res: any) => {
                this.products.set(res.data || []);
                this.loading.set(false);
            },
            error: (err) => {
                this.logger.error('Error loading products', err);
                this.loading.set(false);
            }
        });
    }

    addToCart(product: Product) {
        this.cart.update(items => {
            const existing = items.find(i => i.id === product.id);
            if (existing) {
                if (existing.quantity >= product.stock) {
                    this.notificationService.showWarning(`Stock insuficiente para ${product.name}`);
                    return items;
                }
                return items.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...items, { ...product, quantity: 1 }];
        });
    }

    removeFromCart(productId: string) {
        this.cart.update(items => items.filter(i => i.id !== productId));
    }

    clearCart() {
        this.cart.set([]);
        this.discount.set(0);
        this.customerName.set('');
    }

    updateDiscount(value: any) {
        const num = parseFloat(value);
        this.discount.set(isNaN(num) ? 0 : num);
    }

    updateQuantity(productId: string, change: number) {
        this.cart.update(items => {
            return items.map(i => {
                if (i.id === productId) {
                    const product = this.products().find(p => p.id === productId);
                    const stock = product?.stock || 0;
                    const newQty = i.quantity + change;

                    if (newQty > stock) {
                         this.notificationService.showWarning(`Solo quedan ${stock} unidades.`);
                         return i;
                    }
                    return newQty > 0 ? { ...i, quantity: newQty } : i;
                }
                return i;
            });
        });
    }

    async checkout() {
        if (this.cart().length === 0) return;
        this.processing.set(true);

        try {
            const branch_id = this.branchContextService.getBranchId() || undefined;

            // 1. Create Order
            const order: Order = {
                customer_name: this.customerName() || 'Consumidor Final',
                customer_email: undefined,
                status: 'completed',
                subtotal: this.cartSubtotal(),
                tax: 0,
                discount: this.discount(),
                total: this.finalTotal(),
                branch_id: branch_id, // CRITICAL: Assign the branch!
                payment_method: this.paymentMethod()
            };

            const rate = this.tenantService.currentTenant()?.usd_rate || 1;
            const items: OrderItem[] = this.cart().map(item => {
                const finalUnitPrice = item.currency === 'USD' ? (item.price * rate) : item.price;
                return {
                    product_id: item.id,
                    product_name: item.name,
                    unit_price: finalUnitPrice,
                    unit_cost_at_time: item.unit_cost_at_time || 0,
                    quantity: item.quantity,
                    subtotal: finalUnitPrice * item.quantity
                };
            });

            order.items = items;

            const createdOrder = await firstValueFrom(this.orderService.createOrder(order));
            if (!createdOrder) throw new Error('Order creation failed');

            // 2. Generate Invoice
            const invoiceResult = await this.invoiceService.generateInvoice({
                order_id:      createdOrder.id,
                customer_name: this.customerName() || 'Consumidor Final',
                type:          'B',
                origin:        'sale',
                subtotal:      this.cartSubtotal(),
                tax_amount:    0,
                discount:      this.discount(),
                total_amount:  this.finalTotal(),
            });

            if (invoiceResult.error) {
                this.logger.error('Invoice creation failed after sale', invoiceResult.error);
                this.notificationService.showWarning('La venta fue exitosa pero hubo un problema al generar el comprobante.');
            } else {
                this.notificationService.showSuccess('✅ Venta procesada correctamente.');
            }

            // 4. Record Cash Movement
            if (this.paymentMethod() === 'efectivo' && createdOrder?.id) {
                await this.financeService.recordMovement({
                    amount: this.finalTotal(),
                    type: 'income',
                    category: 'sale',
                    payment_method: 'cash',
                    reference_id: createdOrder.id,
                    notes: `Venta POS - Ticket #${createdOrder.id.substring(0,8)}`,
                    branch_id: branch_id // Also attribute movement to branch
                });
            }

            this.clearCart();
            this.router.navigate(['/admin/sales/invoices']);

        } catch (e: any) {
            this.logger.error('Checkout error', e);
            this.notificationService.showError('Error al procesar la venta: ' + e.message);
        } finally {
            this.processing.set(false);
        }
    }
}
