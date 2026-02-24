import { Component, inject, OnInit, signal, computed } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { TenantService } from '@app/core/services/tenant.service';
import { ProductRepository } from '@app/features/products/domain/repositories/product.repository';

@Component({
    selector: 'app-admin-purchase-form-page',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './admin-purchase-form-page.html',
})
export class AdminPurchaseFormPage implements OnInit {
    private auth = inject(AuthService);
    private router = inject(Router);
    private tenantService = inject(TenantService);
    private productRepository = inject(ProductRepository);

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
        const tenantId = this.tenantService.getTenantId();

        // 1. Fetch products using the clean Repository pattern
        this.productRepository.findAvailable().subscribe(products => {
            this.products.set(products);
        });

        // 2. Safely fetch suppliers avoiding data leaks
        const { data: suppliersRes } = await supabase
            .from('suppliers')
            .select('*')
            .eq('is_active', true)
            .eq('tenant_id', tenantId);

        if (suppliersRes) this.suppliers.set(suppliersRes);

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
            const tenantId = this.tenantService.getTenantId();

            // 1. Create Purchase
            const { data: purchase, error: purchaseError } = await supabase
                .from('purchases')
                .insert({
                    supplier_id: this.form().supplier_id,
                    date: this.form().purchase_date, // fixed mapped property per schema
                    status: this.form().status,
                    total_amount: this.total(),
                    tenant_id: tenantId
                })
                .select()
                .single();

            if (purchaseError) throw purchaseError;

            // 2. Create Purchase Items
            const purchaseItems = this.items().map(item => ({
                purchase_id: purchase.id,
                product_id: item.product_id,
                quantity: item.quantity,
                unit_cost: item.unit_cost,
                tenant_id: tenantId
            }));

            const { error: itemsError } = await supabase
                .from('purchase_items')
                .insert(purchaseItems);

            if (itemsError) throw itemsError;

            // 3. Update Stock (if status is received)
            if (this.form().status === 'received') {
                for (const item of this.items()) {
                    // Manual update respecting tenant
                    const { data: currentProduct } = await supabase.from('products').select('stock').eq('id', item.product_id).eq('tenant_id', tenantId).single();
                    if (currentProduct) {
                        await supabase.from('products').update({ stock: currentProduct.stock + item.quantity }).eq('id', item.product_id).eq('tenant_id', tenantId);
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
