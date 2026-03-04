import { Component, inject, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { TenantService } from '@app/core/services/tenant.service';
import { OrderService } from '@app/core/services/order.service';
import { InvoiceService } from '@app/features/sales/application/invoice.service';
import { Product } from '@app/features/products/domain/entities/product.entity';
import { ProductRepository } from '@app/features/products/domain/repositories/product.repository';
import { LoggerService } from '@app/core/services/logger.service';
import { Order, OrderItem } from '@app/shared/interfaces/order.interface';
import { Pagination } from '@app/shared/components/pagination/pagination';
import { FinanceService } from '@app/core/services/finance.service';

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
    private invoiceService = inject(InvoiceService);
    private financeService = inject(FinanceService);

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

    // Computed: Paginated Products
    paginatedProducts = computed(() => {
        const all = this.filteredProducts();
        const start = (this.currentPage() - 1) * this.itemsPerPage();
        return all.slice(start, start + this.itemsPerPage());
    });

    // Computed: Total Pages
    totalPages = computed(() => Math.ceil(this.filteredProducts().length / this.itemsPerPage()));

    // Computed: Cart Totals
    cartSubtotal = computed(() => this.cart().reduce((acc, item) => acc + (item.price * item.quantity), 0));
    finalTotal = computed(() => Math.max(0, this.cartSubtotal() - (this.discount() || 0)));
    cartCount = computed(() => this.cart().reduce((acc, item) => acc + item.quantity, 0));

    constructor() {
        // Reset pagination on search
        effect(() => {
            this.searchQuery();
            // Optional: reset to page 1 on search
            // We should only do this if it's an actual user search interaction, 
            // but the effect trigger is enough for now. The URL will still govern the current page via route subscription.
        }, { allowSignalWrites: true });
    }

    private route = inject(ActivatedRoute);

    async ngOnInit() {
        this.route.queryParams.subscribe((params: any) => {
            const page = params['_page'] ? parseInt(params['_page'], 10) : 1;
            this.currentPage.set(page || 1);
        });

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
        const tenantId = this.tenantService.getTenantId();

        try {
            // 1. Create Order (acting as a Sale)
            const order: Order = {
                customer_name: this.customerName() || 'Consumidor Final',
                customer_email: undefined,
                status: 'completed',
                subtotal: this.cartSubtotal(),
                tax: 0,
                discount: this.discount(),
                total: this.finalTotal()
            };

            const items: OrderItem[] = this.cart().map(item => ({
                product_id: item.id,
                product_name: item.name,
                unit_price: item.price,
                quantity: item.quantity,
                subtotal: item.price * item.quantity
            }));

            const { data: createdOrder, error: orderError } = await this.orderService.createOrder(order, items);
            if (orderError || !createdOrder) throw orderError || new Error('Order creation failed');

            // 2. Decrement stock (with fallback)
            for (const item of this.cart()) {
                const { error: stockError } = await supabase.rpc('decrement_stock_tenant', {
                    row_id: item.id,
                    amount: item.quantity,
                    t_id: tenantId
                });
                if (stockError) {
                    const { data: cur } = await supabase
                        .from('products').select('stock')
                        .eq('id', item.id).eq('tenant_id', tenantId).single();
                    if (cur) {
                        await supabase.from('products')
                            .update({ stock: cur.stock - item.quantity })
                            .eq('id', item.id).eq('tenant_id', tenantId);
                    }
                }
            }

            // 3. Generate Invoice via InvoiceService (duplicate guard + canonical totals)
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
                // Don't block the sale — the order was already created
            }

            // 4. Record Cash Movement [USER-REQ]
            if (this.paymentMethod() === 'efectivo' && createdOrder?.id) {
                await this.financeService.recordMovement({
                    amount: this.finalTotal(),
                    type: 'income',
                    category: 'sale',
                    payment_method: 'cash',
                    reference_id: createdOrder.id,
                    notes: `Venta POS - Ticket #${createdOrder.id.substring(0,8)}`
                });
            }

            this.clearCart();
            this.router.navigate(['/admin/sales/invoices']);

        } catch (e: any) {
            this.logger.error('Checkout error', e);
            alert('Error al procesar la venta: ' + e.message);
        } finally {
            this.processing.set(false);
        }
    }
}
