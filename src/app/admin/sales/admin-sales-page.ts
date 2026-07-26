import { Component, inject, OnInit, signal, computed, effect, untracked, HostListener, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Params } from '@angular/router';

import { CheckoutUseCase } from '@app/features/sales/application/usecases/checkout.usecase';
import { Product } from '@app/features/products/domain/entities/product.entity';
import { ProductRepository } from '@app/features/products/domain/repositories/product.repository';
import { AdminProductService } from '@app/admin/products/services/admin-product.service';
import { LoggerService } from '@app/core/services/logger.service';
import { Order, OrderItem } from '@app/features/orders/domain/entities/order.entity';
import { Pagination } from '@app/shared/components/pagination/pagination';

import { TranslationService } from '@app/core/services/translation.service';
import { TenantService } from '@app/core/services/tenant.service';
import { NotificationService } from '@app/core/services/notification.service';
import { BranchContextService } from '@app/core/services/branch-context.service';

interface CartItem extends Product {
    quantity: number;
}

@Component({
    selector: 'app-admin-sales-page',
    standalone: true,
    imports: [CommonModule, FormsModule, Pagination, RouterLink],
    templateUrl: './admin-sales-page.html',
    host: {
        class: 'flex flex-col flex-1 h-full min-h-0'
    }
})
export class AdminSalesPage implements OnInit {
    private router = inject(Router);
    private logger = inject(LoggerService);
    private productService = inject(AdminProductService);
    private checkoutUseCase = inject(CheckoutUseCase);
    public tenantService = inject(TenantService);
    private notificationService = inject(NotificationService);
    public t = inject(TranslationService).t;

    private branchContextService = inject(BranchContextService);

    @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

    // Data Signals
    products = signal<Product[]>([]);
    cart = signal<CartItem[]>([]);
    
    // UI State Signals
    searchQuery = signal(''); // Backend query
    searchInputText = signal(''); // UI input
    searchSubject = new Subject<string>();
    loading = signal(false);
    processing = signal(false);
    isCartOpenMobile = signal(false); // For mobile responsiveness
    customerName = signal('');
    discount = signal<number>(0);
    paymentMethod = signal<'efectivo' | 'transferencia' | 'tarjeta'>('efectivo');

    // Pagination Signals
    currentPage = signal(1);
    itemsPerPage = signal(24);
    totalItems = signal(0);
    totalPages = signal(1);

    // Computed: Filtered Products
    filteredProducts = computed(() => {
        return this.products();
    });

    paginatedProducts = computed(() => {
        // Since backend already paginates, we just return the current array
        return this.products();
    });

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
        // Setup search debounce for server-side search
        this.searchSubject.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(query => {
            this.searchQuery.set(query);
            this.searchInputText.set(query); // Sync UI
            this.currentPage.set(1);
            
            // Remove page from URL so it defaults to 1 cleanly
            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: { _page: null },
                queryParamsHandling: 'merge'
            });
            
            this.loadProducts();
        });

        // RE-LOAD products on branch change!
        effect(() => {
            this.branchContextService.getBranchId();
            untracked(() => this.loadProducts());
        });
    }

    private route = inject(ActivatedRoute);

    @HostListener('window:keydown.f3', ['$event'])
    handleF3(event: Event) {
        event.preventDefault();
        if (this.searchInput) {
            this.searchInput.nativeElement.focus();
        }
    }

    async ngOnInit() {
        this.route.queryParams.subscribe((params: Params) => {
            const page = params['_page'] ? parseInt(params['_page'], 10) : 1;
            this.currentPage.set(page || 1);
        });
    }

    async loadProducts() {
        this.loading.set(true);
        const q = this.searchQuery();

        try {
            const res = await this.productService.getProductsPaginated({
                q,
                _page: this.currentPage(),
                _per_page: this.itemsPerPage(),
                include_inactive: false
            });
            this.products.set((res.data || []) as unknown as Product[]);
            this.totalItems.set(res.items || 0);
            this.totalPages.set(res.pages || 1);
        } catch (err) {
            this.logger.error('Error loading products', err);
        } finally {
            this.loading.set(false);
        }
    }

    onSearchChange(query: string) {
        this.searchSubject.next(query);
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

    updateDiscount(value: number | string) {
        const num = typeof value === 'string' ? parseFloat(value) : value;
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
            await this.checkoutUseCase.execute({
                cartItems: this.cart(),
                customerName: this.customerName(),
                discount: this.discount(),
                paymentMethod: this.paymentMethod(),
                cartSubtotal: this.cartSubtotal(),
                finalTotal: this.finalTotal()
            });

            this.notificationService.showSuccess('Venta procesada con éxito');
            this.clearCart();
            this.router.navigate(['/admin/sales/invoices']);

        } catch (e: unknown) {
            this.logger.error('Checkout error', e);
            const errorMessage = e instanceof Error ? e.message : 'Error desconocido';
            this.notificationService.showError('Error al procesar la venta: ' + errorMessage);
        } finally {
            this.processing.set(false);
        }
    }
}

