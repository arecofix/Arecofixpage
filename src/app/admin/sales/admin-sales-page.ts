import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { Product } from '@app/features/products/domain/entities/product.entity';
import { LoggerService } from '@app/core/services/logger.service';

interface CartItem extends Product {
    quantity: number;
}

@Component({
    selector: 'app-admin-sales-page',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin-sales-page.html',
})
export class AdminSalesPage implements OnInit {
    private auth = inject(AuthService);
    private router = inject(Router);
    private logger = inject(LoggerService);

    products = signal<Product[]>([]);
    cart = signal<CartItem[]>([]);
    searchQuery = signal('');
    loading = signal(false);
    processing = signal(false);

    // Computed totals
    total = computed(() => this.cart().reduce((acc, item) => acc + (item.price * item.quantity), 0));

    async ngOnInit() {
        await this.loadProducts();
    }

    async loadProducts() {
        this.loading.set(true);
        const supabase = this.auth.getSupabaseClient();
        const { data } = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .gt('stock', 0)
            .order('name');

        if (data) {
            this.products.set(data);
        }
        this.loading.set(false);
    }

    addToCart(product: any) {
        this.cart.update(items => {
            const existing = items.find(i => i.id === product.id);
            if (existing) {
                return items.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...items, { ...product, quantity: 1 }];
        });
    }

    removeFromCart(productId: string) {
        this.cart.update(items => items.filter(i => i.id !== productId));
    }

    updateQuantity(productId: string, change: number) {
        this.cart.update(items => {
            return items.map(i => {
                if (i.id === productId) {
                    const newQty = i.quantity + change;
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
            // 1. Create Sale
            const { data: sale, error: saleError } = await supabase
                .from('sales')
                .insert({
                    staff_id: user?.id,
                    total_amount: this.total(),
                    status: 'completed',
                    payment_method: 'cash' // TODO: Add payment method selection
                })
                .select()
                .single();

            if (saleError) throw saleError;

            // 2. Create Sale Items
            const saleItems = this.cart().map(item => ({
                sale_id: sale.id,
                product_id: item.id,
                quantity: item.quantity,
                unit_price: item.price,
                subtotal: item.price * item.quantity
            }));

            const { error: itemsError } = await supabase
                .from('sale_items')
                .insert(saleItems);

            if (itemsError) throw itemsError;

            // 3. Update Stock (This should ideally be a database trigger or RPC to be safe)
            for (const item of this.cart()) {
                const { error: stockError } = await supabase.rpc('decrement_stock', {
                    row_id: item.id,
                    amount: item.quantity
                });
                // Fallback if RPC doesn't exist (though it's safer with RPC)
                if (stockError) {
                    // Manual update (race condition risk but okay for MVP)
                    const { data: currentProduct } = await supabase.from('products').select('stock').eq('id', item.id).single();
                    if (currentProduct) {
                        await supabase.from('products').update({ stock: currentProduct.stock - item.quantity }).eq('id', item.id);
                    }
                }
            }

            // 4. Create Invoice (Optional auto-generation)
            await supabase.from('invoices').insert({
                sale_id: sale.id,
                total_amount: this.total(),
                type: 'B', // Default to B for final consumer
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

    filteredProducts() {
        const query = this.searchQuery().toLowerCase();
        return this.products().filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.sku?.toLowerCase().includes(query) ||
            p.barcode?.toLowerCase().includes(query)
        );
    }
}
