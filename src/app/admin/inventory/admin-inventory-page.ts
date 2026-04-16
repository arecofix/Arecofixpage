import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed, effect, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product } from '@app/features/products/domain/entities/product.entity';
import { AdminProductService } from '../products/services/admin-product.service';
import { Pagination } from '@app/shared/components/pagination/pagination';
import { SearchUtils } from '@app/shared/utils/search.utils';

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
    sortOrder = signal<'stock_asc' | 'stock_desc' | 'name_asc' | 'price_asc' | 'relevance'>('relevance'); 
    filterStatus = signal<'all' | 'low_stock' | 'out_of_stock'>('all');
    selectedCategoryId = signal<string>('all');

    // Pagination
    currentPage = signal<number>(1);
    itemsPerPage = signal<number>(15);
    totalItems = signal<number>(0);
    pagesCount = signal<number>(1);

    pageValue = computed(() => {
        return this.products().reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0);
    });

    constructor() {
        // Reactive reload on filter change
        effect(() => {
            // Read values to trigger effect
            const query = this.searchQuery();
            const status = this.filterStatus();
            const category = this.selectedCategoryId();
            const sort = this.sortOrder();
            const page = this.currentPage();
            
            // Reload
            untracked(() => this.loadInventory());
        });
    }

    async ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params['_page']) this.currentPage.set(Number(params['_page']));
            if (params['q']) this.searchQuery.set(params['q']);
            if (params['status']) this.filterStatus.set(params['status'] as any);
        });
        await this.loadCategories();
    }

    async loadCategories() {
        try {
            const cats = await this.productService.getCategories();
            const mappedCats = cats.map(c => ({
                ...c,
                name: (c.name.toLowerCase() === 'smartphones' || c.name.toLowerCase() === 'smartphone') 
                      ? 'Celulares' 
                      : c.name
            }));
            this.categories.set(mappedCats);
        } catch (e) {
            console.error('Error loading categories', e);
        }
    }

    async loadInventory() {
        this.loading.set(true);
        try {
            const sortMap: Record<string, { sort: string, order: 'asc' | 'desc' }> = {
                'stock_asc': { sort: 'stock', order: 'asc' },
                'stock_desc': { sort: 'stock', order: 'desc' },
                'price_asc': { sort: 'price', order: 'asc' },
                'name_asc': { sort: 'name', order: 'asc' },
                'relevance': { sort: 'name', order: 'asc' }
            };

            const currentSort = sortMap[this.sortOrder()] || sortMap['relevance'];

            const params: any = {
                _page: this.currentPage(),
                _per_page: this.itemsPerPage(),
                q: this.searchQuery(),
                stock_status: this.filterStatus(),
                _sort: currentSort.sort,
                _order: currentSort.order
            };

            if (this.selectedCategoryId() !== 'all') {
                params.category_id = this.selectedCategoryId();
            }

            const res = await this.productService.getProductsPaginated(params);
            this.products.set(res.data as any[]);
            this.totalItems.set(res.items);
            this.pagesCount.set(res.pages);
        } catch (e: any) {
            this.error.set(e.message || 'Error al cargar inventario');
        } finally {
            this.loading.set(false);
        }
    }

    onPageChange(page: number) {
        this.currentPage.set(page);
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
