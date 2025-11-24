import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/services/auth.service';

@Component({
    selector: 'app-admin-purchase-form-page',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './admin-purchase-form-page.html',
})
export class AdminPurchaseFormPage implements OnInit {
    private auth = inject(AuthService);
    private router = inject(Router);

    suppliers = signal<any[]>([]);
    products = signal<any[]>([]);

    form = signal({
        supplier_id: '',
        purchase_date: new Date().toISOString().split('T')[0],
        status: 'received',
    });

    items = signal<any[]>([]); // { product_id, quantity, unit_cost }

    loading = signal(true);
    saving = signal(false);
    error = signal<string | null>(null);

    total = computed(() => this.items().reduce((acc, item) => acc + (item.quantity * item.unit_cost), 0));

    async ngOnInit() {
        const supabase = this.auth.getSupabaseClient();

        const [suppliersRes, productsRes] = await Promise.all([
            supabase.from('suppliers').select('*').eq('is_active', true),
            supabase.from('products').select('*').eq('is_active', true)
        ]);

        if (suppliersRes.data) this.suppliers.set(suppliersRes.data);
        if (productsRes.data) this.products.set(productsRes.data);

        this.loading.set(false);
    }

    addItem() {
        this.items.update(i => [...i, { product_id: '', quantity: 1, unit_cost: 0 }]);
    }

    removeItem(index: number) {
        this.items.update(i => i.filter((_, idx) => idx !== index));
    }

    updateItem(index: number, field: string, value: any) {
        this.items.update(items => {
            const newItems = [...items];
            newItems[index] = { ...newItems[index], [field]: value };
            return newItems;
        });
    }

    async save() {
        if (this.items().length === 0) {
            this.error.set('Debe agregar al menos un producto');
            return;
        }

        if (!this.form().supplier_id) {
            this.error.set('Debe seleccionar un proveedor');
            return;
        }

        this.saving.set(true);
        this.error.set(null);
        const supabase = this.auth.getSupabaseClient();

        try {
            // 1. Create Purchase
            const { data: purchase, error: purchaseError } = await supabase
                .from('purchases')
                .insert({
                    supplier_id: this.form().supplier_id,
                    purchase_date: this.form().purchase_date,
                    status: this.form().status,
                    total_amount: this.total()
                })
                .select()
                .single();

            if (purchaseError) throw purchaseError;

            // 2. Create Purchase Items
            const purchaseItems = this.items().map(item => ({
                purchase_id: purchase.id,
                product_id: item.product_id,
                quantity: item.quantity,
                unit_cost: item.unit_cost
            }));

            const { error: itemsError } = await supabase
                .from('purchase_items')
                .insert(purchaseItems);

            if (itemsError) throw itemsError;

            // 3. Update Stock (if status is received)
            if (this.form().status === 'received') {
                for (const item of this.items()) {
                    // Using RPC would be better, but manual update for now
                    const { data: currentProduct } = await supabase.from('products').select('stock').eq('id', item.product_id).single();
                    if (currentProduct) {
                        await supabase.from('products').update({ stock: currentProduct.stock + item.quantity }).eq('id', item.product_id);
                    }
                }
            }

            this.router.navigate(['/admin/purchases']);
        } catch (e: any) {
            this.error.set(e.message);
        } finally {
            this.saving.set(false);
        }
    }
}
