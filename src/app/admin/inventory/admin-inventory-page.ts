import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product } from '@app/features/products/domain/entities/product.entity';
import { AdminProductService } from '../products/services/admin-product.service';
import { Pagination } from '@app/shared/components/pagination/pagination';

@Component({
    selector: 'app-admin-inventory-page',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule, Pagination],
    templateUrl: './admin-inventory-page.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminInventoryPage implements OnInit {
    private productService = inject(AdminProductService);
    private route = inject(ActivatedRoute);

    // Signals
    products = signal<Product[]>([]);
    loading = signal(true);
    error = signal<string | null>(null);

    // Filter & Sort
    categories = signal<any[]>([]);
    searchQuery = signal<string>('');
    sortOrder = signal<'stock_asc' | 'stock_desc' | 'name_asc' | 'price_asc'>('stock_asc'); 
    filterStatus = signal<'all' | 'low_stock' | 'out_of_stock'>('all');
    selectedCategoryId = signal<string>('all');

    // Pagination
    currentPage = signal<number>(1);
    itemsPerPage = signal<number>(15);

    // Computed: Filtered & Sorted
    filteredProducts = computed(() => {
        let result = this.products();
        const query = this.searchQuery().toLowerCase();
        const status = this.filterStatus();

        // 1. Filter by Status
        if (status === 'low_stock') {
            result = result.filter(p => p.stock > 0 && p.stock <= (p.min_stock_alert || 5)); 
        } else if (status === 'out_of_stock') {
            result = result.filter(p => p.stock === 0);
        }

        // 2. Filter by Category
        if (this.selectedCategoryId() !== 'all') {
            result = result.filter(p => p.category_id === this.selectedCategoryId());
        }

        // 3. Filter by Search
        if (query) {
            result = result.filter(p => 
                p.name.toLowerCase().includes(query) || 
                p.sku?.toLowerCase().includes(query) ||
                p.barcode?.toLowerCase().includes(query)
            );
        }

        // 3. Sort
        const sort = this.sortOrder();
        return result.sort((a, b) => {
            switch (sort) {
                case 'stock_asc': return a.stock - b.stock;
                case 'stock_desc': return b.stock - a.stock;
                case 'price_asc': return a.price - b.price;
                case 'name_asc': default: return a.name.localeCompare(b.name);
            }
        });
    });

    // Computed: Paginated Slice
    paginatedProducts = computed(() => {
        const all = this.filteredProducts();
        const page = this.currentPage();
        const perPage = this.itemsPerPage();
        const start = (page - 1) * perPage;
        return all.slice(start, start + perPage);
    });

    // Computed: Total Pages
    totalPages = computed(() => {
        return Math.ceil(this.filteredProducts().length / this.itemsPerPage());
    });

    // Computed: Stats
    stats = computed(() => {
        const all = this.products();
        return {
            total: all.length,
            lowStock: all.filter(p => p.stock > 0 && p.stock <= (p.min_stock_alert || 5)).length,
            outOfStock: all.filter(p => p.stock === 0).length,
            totalValue: all.reduce((sum, p) => sum + (p.price * p.stock), 0)
        };
    });

    async ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params['_page']) this.currentPage.set(Number(params['_page']));
        });
        await Promise.all([
            this.loadInventory(),
            this.loadCategories()
        ]);
    }

    async loadCategories() {
        try {
            const cats = await this.productService.getCategories();
            this.categories.set(cats);
        } catch (e) {
            console.error('Error loading categories', e);
        }
    }

    async loadInventory() {
        this.loading.set(true);
        try {
            const data = await this.productService.getProducts();
            this.products.set(data);
        } catch (e: any) {
            this.error.set(e.message || 'Error al cargar inventario');
        } finally {
            this.loading.set(false);
        }
    }

    // Helpers
    getCategoryName(id?: string): string {
        if (!id) return 'Sin categoría';
        const cat = this.categories().find(c => c.id === id);
        return cat ? cat.name : 'ID: ' + id.slice(0, 5);
    }

    updateSort(event: Event) {
        this.sortOrder.set((event.target as HTMLSelectElement).value as any);
    }
}
