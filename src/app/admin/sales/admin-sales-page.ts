import { Component, inject, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { TenantService } from '@app/core/services/tenant.service';
import { OrderService } from '@app/core/services/order.service';
import { Product } from '@app/features/products/domain/entities/product.entity';
import { ProductRepository } from '@app/features/products/domain/repositories/product.repository';
import { LoggerService } from '@app/core/services/logger.service';
import { Order, OrderItem } from '@app/shared/interfaces/order.interface';
import { Pagination } from '@app/shared/components/pagination/pagination';

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
    private auth = inject(AuthService);
    private router = inject(Router);
    private logger = inject(LoggerService);
    private tenantService = inject(TenantService);
    private productRepository = inject(ProductRepository);
    private orderService = inject(OrderService);

    // Data Signals
    products = signal<Product[]>([]);
    cart = signal<CartItem[]>([]);
    
    // UI State Signals
    searchQuery = signal('');
    loading = signal(false);
    processing = signal(false);
    isCartOpenMobile = signal(false); // For mobile responsiveness

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

    // Computed: Paginated Products
    paginatedProducts = computed(() => {
        const all = this.filteredProducts();
        const start = (this.currentPage() - 1) * this.itemsPerPage();
        return all.slice(start, start + this.itemsPerPage());
    });

    // Computed: Total Pages
    totalPages = computed(() => Math.ceil(this.filteredProducts().length / this.itemsPerPage()));

    // Computed: Cart Totals
    cartTotal = computed(() => this.cart().reduce((acc, item) => acc + (item.price * item.quantity), 0));
    cartCount = computed(() => this.cart().reduce((acc, item) => acc + item.quantity, 0));

    constructor() {
        // Reset pagination on search
        effect(() => {
            this.searchQuery();
            this.currentPage.set(1);
        });
    }

    async ngOnInit() {
        await this.loadProducts();
    }

    async loadProducts() {
        this.loading.set(true);
        this.productRepository.findAvailable().subscribe({
            next: (data) => {
                this.products.set(data);
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
                // Check stock limit
                if (existing.quantity >= product.stock) {
                    // Optional: Show toast "Stock limit reached"
                    return items;
                }
                return items.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...items, { ...product, quantity: 1 }];
        });
        
        // On mobile, maybe hint cart updated?
    }

    removeFromCart(productId: string) {
        this.cart.update(items => items.filter(i => i.id !== productId));
    }

    updateQuantity(productId: string, change: number) {
        this.cart.update(items => {
            return items.map(i => {
                if (i.id === productId) {
                    const product = this.products().find(p => p.id === productId);
                    const stock = product?.stock || 0;
                    const newQty = i.quantity + change;

                    if (newQty > stock) return i; // Prevent exceeding stock
                    return newQty > 0 ? { ...i, quantity: newQty } : i;
                }
                return i;
            });
        });
    }

    async checkout() {
        if (this.cart().length === 0) return;
        this.processing.set(true);
        const supabase = this.auth.getSupabaseClient();
        const user = this.auth.getCurrentUser();

        try {
            const tenantId = this.tenantService.getTenantId();

            // 1. Create Order (acting as a Sale)
            const order: Order = {
                customer_name: 'Venta Mostrador',
                customer_email: 'mostrador@arecofix.com',
                status: 'completed',
                subtotal: this.cartTotal(),
                tax: 0,
                discount: 0,
                total: this.cartTotal()
            };

            const items: OrderItem[] = this.cart().map(item => ({
                product_id: item.id,
                product_name: item.name,
                unit_price: item.price,
                quantity: item.quantity,
                subtotal: item.price * item.quantity
            }));

            const { data: createdOrder, error: orderError } = await this.orderService.createOrder(order, items);
            if (orderError || !createdOrder) throw orderError || new Error("Order creation failed");

            // 3. Update Stock manually with isolation
            for (const item of this.cart()) {
                const { error: stockError } = await supabase.rpc('decrement_stock_tenant', {
                    row_id: item.id,
                    amount: item.quantity,
                    t_id: tenantId
                });
                
                if (stockError) {
                    // Manual Fallback
                    const { data: currentProduct } = await supabase.from('products').select('stock').eq('id', item.id).eq('tenant_id', tenantId).single();
                    if (currentProduct) {
                        await supabase.from('products').update({ stock: currentProduct.stock - item.quantity }).eq('id', item.id).eq('tenant_id', tenantId);
                    }
                }
            }

            // 4. Create Invoice
            await supabase.from('invoices').insert({
                order_id: createdOrder.id,
                tenant_id: tenantId,
                total_amount: this.cartTotal(),
                type: 'B', 
                issued_at: new Date().toISOString()
            });

            this.cart.set([]);
            this.router.navigate(['/admin/invoices']);

        } catch (e: any) {
            this.logger.error('Checkout error', e);
            alert('Error al procesar la venta: ' + e.message);
        } finally {
            this.processing.set(false);
        }
    }
}
