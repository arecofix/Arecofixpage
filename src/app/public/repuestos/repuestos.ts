import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { IsEmptyComponent, IsErrorComponent, IsLoadingComponent } from '@app/shared/components/resource-status';
import { CategoryService } from '@app/public/categories/services';
import { ProductService } from '@app/public/products/services';
import { ProductCard } from '@app/public/products/components';
import { Pagination, PaginationService, iPagination } from '@app/shared/components/pagination';
import { iCategory } from '@app/public/categories/interfaces';
import { BrandRepository } from '@app/features/products/data/repositories/brand.repository';
import { Brand } from '@app/features/products/domain/entities/brand.entity';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-repuestos',
    standalone: true,
    imports: [CommonModule, FormsModule, IsEmptyComponent, IsErrorComponent, IsLoadingComponent, ProductCard, Pagination],
    templateUrl: './repuestos.html',
    styleUrl: './repuestos.scss'
})
export class RepuestosComponent implements OnInit {
    whatsappNumber = environment.contact.whatsappNumber;
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private categoryService = inject(CategoryService);
    private productService = inject(ProductService);
    private brandRepo = inject(BrandRepository);
    public paginationService = inject(PaginationService);

    // Signals for data
    categories = signal<iCategory[]>([]);
    brands = signal<Brand[]>([]);
    
    // Filter state (bound to template)
    filterState = {
        search: '',
        category: 'all',
        brand: 'all',
        maxPrice: null as number | null,
        sort: 'relevance' as 'relevance' | 'price-asc' | 'price-desc' | 'rating-desc',
    };

    // Active filter (triggers resource)
    activeFilter = signal({ ...this.filterState });

    // Resource for products
    productsRs = rxResource({
        stream: () => {
            const f = this.activeFilter();
            const page = this.paginationService.currentPage() || 1;
            
            // Build params
            const params: any = {
                _page: page,
                _per_page: 12,
            };

            if (f.search) params.name = f.search;
            if (f.category !== 'all') params.category_id = f.category;
            if (f.brand !== 'all') params.brand_id = f.brand;
            if (f.maxPrice) params.price = f.maxPrice; // Note: ProductService uses exact match for price currently, might need range later
            
            return this.productService.getData(params);
        }
    });

    paginationData = computed<iPagination | null>(() => {
        const data = this.productsRs.value();
        if (!data) return null;
        const { data: products, ...pagination } = data;
        return pagination as iPagination;
    });

    async ngOnInit() {
        await this.loadCategories();
        await this.loadBrands();
    }

    async loadCategories() {
        this.categoryService.getData({ _page: 1, _per_page: 100 }).subscribe(res => {
            this.categories.set(res.data);
        });
    }

    async loadBrands() {
        try {
            const brands = await this.brandRepo.findAll({ column: 'name', ascending: true });
            this.brands.set(brands);
        } catch (e) {
            console.error('Error loading brands', e);
        }
    }

    applyFilters() {
        this.activeFilter.set({ ...this.filterState });
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { _page: 1 },
            queryParamsHandling: 'merge'
        });
    }

    goToHome() {
        this.router.navigate(['/']);
    }
}
