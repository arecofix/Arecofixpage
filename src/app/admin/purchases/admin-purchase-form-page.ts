import { Component, inject, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductRepository } from '@app/features/products/domain/repositories/product.repository';
import { Product } from '@app/features/products/domain/entities/product.entity';
import { FinanceService } from '@app/features/finance/application/services/finance.service';
import { Location } from '@angular/common';
import { AdminProductService } from '../products/services/admin-product.service';
import { AdminPurchaseService } from './services/admin-purchase.service';

@Component({
    selector: 'app-admin-purchase-form-page',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './admin-purchase-form-page.html',
})
export class AdminPurchaseFormPage implements OnInit {
    private router = inject(Router);
    private productRepository = inject(ProductRepository);
    private location = inject(Location);
    private purchaseService = inject(AdminPurchaseService);
    private adminProductService = inject(AdminProductService);

    suppliers = signal<any[]>([]);
    branches = signal<any[]>([]);
    products = signal<Product[]>([]);

    form = signal({
        supplier_id: '',
        branch_id: '',
        purchase_date: new Date().toISOString().split('T')[0],
        status: 'received',
        payment_method: 'efectivo',
    });

    items = signal<any[]>([]); // { product_id, name, quantity, unit_cost }

    // Search
    searchQuery = signal('');
    isSearchFocused = signal(false);
    
    filteredProducts = computed(() => {
        const query = this.searchQuery().toLowerCase().trim();
        if (!query) return [];
        return this.products().filter(p => 
            p.name.toLowerCase().includes(query) || 
            (p.sku && p.sku.toLowerCase().includes(query)) ||
            (p.barcode && p.barcode.toLowerCase().includes(query))
        ).slice(0, 10);
    });

    // Quick Product Modal
    isNewProductModalOpen = signal(false);
    newProductSaving = signal(false);

    updateNewProductField(field: keyof typeof this.newProductForm.prototype | string, value: any) {
        this.newProductForm.update(f => ({ ...f, [field]: value }));
    }

    newProductForm = signal({
        name: '',
        sku: '',
        sale_price: 0,
        unit_cost: 0,
        initial_quantity: 1
    });

    loading = signal(true);
    saving = signal(false);
    error = signal<string | null>(null);

    total = computed(() => this.items().reduce((acc, item) => acc + (item.quantity * item.unit_cost), 0));

    async ngOnInit() {
        const suppliersRes = await this.purchaseService.getSuppliers();
        if (suppliersRes) this.suppliers.set(suppliersRes);

        const branchesRes = await this.adminProductService.getBranches();
        this.branches.set(branchesRes);

        this.loading.set(false);
    }

    selectProductFromSearch(product: Product) {
        this.addItemToPurchase(product.id, product.name, 1, product.price || 0); // Default to selling price or 0 cost
        this.searchQuery.set('');
        this.isSearchFocused.set(false);
    }

    addItemToPurchase(product_id: string, name: string, quantity: number, unit_cost: number) {
        // Find if already exists in items
        const existingItems = this.items();
        const index = existingItems.findIndex(i => i.product_id === product_id);
        
        if (index > -1) {
            this.updateItem(index, 'quantity', existingItems[index].quantity + quantity);
        } else {
            this.items.update(i => [...i, { product_id, name, quantity, unit_cost }]);
        }
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

    openNewProductModal() {
        this.newProductForm.set({
            name: this.searchQuery() || '',
            sku: '',
            sale_price: 0,
            unit_cost: 0,
            initial_quantity: 1
        });
        this.isNewProductModalOpen.set(true);
    }

    async saveNewProduct() {
        if (!this.newProductForm().name) return;
        
        this.newProductSaving.set(true);
        try {
            const formObj = this.newProductForm();
            const newProdPayload = {
                name: formObj.name,
                sku: formObj.sku,
                price: formObj.sale_price,
                stock: 0, // We set 0 here because the purchase confirmation will add the stock later!
                slug: this.newProductForm().name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now(),
                is_active: true
            };
            
            const createdProduct = await new Promise<Product>((resolve, reject) => {
                this.productRepository.create(newProdPayload as Product).subscribe({
                    next: (res) => resolve(res),
                    error: (err) => reject(err)
                });
            });

            // Add to local list so it can be searched later
            this.products.update(p => [...p, createdProduct]);

            // Add to purchase items
            this.addItemToPurchase(createdProduct.id, createdProduct.name, formObj.initial_quantity, formObj.unit_cost);
            
            this.isNewProductModalOpen.set(false);
            this.searchQuery.set('');
        } catch (e: any) {
            this.error.set('Error al crear producto rápido: ' + e.message);
        } finally {
            this.newProductSaving.set(false);
        }
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
        try {
            await this.purchaseService.createPurchase(this.form(), this.items(), this.total());
            this.router.navigate(['/admin/purchases']);
        } catch (e: any) {
            this.error.set(e.message);
        } finally {
            this.saving.set(false);
        }
    }

    goBack() {
        this.router.navigate(['/admin/purchases']);
    }
}
