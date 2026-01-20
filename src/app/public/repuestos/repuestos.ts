import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, map, of, Subject, switchMap } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
// import { IsEmptyComponent, IsLoadingComponent } from '@app/shared/components/resource-status';
import { CategoryService } from '@app/public/categories/services';
import { ProductService } from '@app/public/products/services';
import { ProductsResponse, Product } from '@app/public/products/interfaces';
import { ProductCard } from '@app/public/products/components';
import { Pagination, PaginationService, iPagination } from '@app/shared/components/pagination';
import { iCategory } from '@app/public/categories/interfaces';
import { BrandRepository } from '@app/features/products/data/repositories/brand.repository';
import { Brand } from '@app/features/products/domain/entities/brand.entity';
import { environment } from '../../../environments/environment';
import { CartService } from '@app/shared/services/cart.service';

@Component({
    selector: 'app-repuestos',
    standalone: true,
    imports: [CommonModule, FormsModule, ProductCard, Pagination],
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
    private cartService = inject(CartService);
    public paginationService = inject(PaginationService);

    // Initial Data State
    categories = signal<iCategory[]>([]);
    brands = signal<Brand[]>([]);
    repuestosCategoryIds = signal<string[]>([]); // The core "Repuestos" definition
    repuestosRootId = signal<string | null>(null);
    isInitialized = signal(false);
    initError = signal<string | null>(null);

    // Search Logic (Debounced navigation)
    private searchSubject = new Subject<string>();

    // UI Signals
    searchQuery = signal('');
    routeParams = signal<any>({});

    currentCategory = computed(() => this.routeParams()['category'] || 'all');
    currentBrand = computed(() => this.routeParams()['brand'] || 'all');
    currentMaxPrice = computed(() => this.routeParams()['price'] || null);
    currentSort = computed(() => this.routeParams()['sort'] || 'relevance');
    
    // Quick View Logic
    isQuickViewOpen = signal(false);
    quickViewProduct = signal<Product | null>(null);

    // Visible Categories for Sidebar
    visibleCategories = computed(() => {
        const rootId = this.repuestosRootId();
        if (!rootId) return [];
        return this.categories().filter(c => c.parent_id === rootId);
    });

    constructor() {
        // Handle Search Debounce -> Update URL
        this.searchSubject.pipe(
            debounceTime(500),
            distinctUntilChanged()
        ).subscribe(term => {
            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: { search: term || null, _page: 1 },
                queryParamsHandling: 'merge'
            });
        });

        // Sync Input with URL
        this.route.queryParams.subscribe(params => {
            this.routeParams.set(params);
            if (params['search'] !== this.searchQuery()) {
                this.searchQuery.set(params['search'] || '');
            }
        });
    }

    // Resource Stream: Depends on Signals (CategoryIDs) and Route Params
    productsRs = rxResource({
        stream: () => {
            // 1. Dependency: Route Params
           return this.route.queryParams.pipe(
                // 2. Dependency: Ensure Categories are loaded
                switchMap(params => {
                    if (!this.isInitialized()) return of(null);
                    
                    const page = params['_page'] || 1;
                    const search = params['search'];
                    const categoryId = params['category']; // Specific selected sub-category
                    const brandId = params['brand'];
                    const maxPrice = params['price'];
                    const sort = params['sort'];

                    const serviceParams: any = {
                        _page: page,
                        _per_page: 12,
                        _sort: sort === 'relevance' ? undefined : sort?.split('-')[0] || 'created_at',
                        _order: sort?.split('-')[1] || 'desc'
                    };

                    // Filter Logic
                    if (search) serviceParams.q = search; // Use 'q' for name OR description

                    if (brandId && brandId !== 'all') serviceParams.brand_id = brandId;
                    if (maxPrice) serviceParams.max_price = maxPrice;

                    // Category Logic
                    if (categoryId && categoryId !== 'all') {
                        // User selected a specific sub-category
                        // We must include this category AND its children
                        serviceParams.category_ids = this.getAllChildIds(categoryId, this.categories());
                    } else {
                        // User is viewing "All Repuestos" -> Use the massive calculated list
                        serviceParams.category_ids = this.repuestosCategoryIds();
                    }

                    // Safety Check: If no IDs found (heuristic failed), return empty
                    if (!serviceParams.category_ids || serviceParams.category_ids.length === 0) {
                         return of({ data: [], items: 0, pages: 0, first: 1, last: 1 } as ProductsResponse);
                    }

                    return this.productService.getData(serviceParams);
                })
            );
        }
    });

    paginationData = computed<iPagination | null>(() => {
        const data = this.productsRs.value();
        if (!data) return null;
        // Handle the case where switchMap returns null (not initialized) or empty
        if (!('data' in data)) return null;

        const { data: products, ...pagination } = data as ProductsResponse;
        return pagination as iPagination;
    });

    async ngOnInit() {
        await this.loadCategories();
        await this.loadBrands();
    }

    onSearch(term: string) {
        this.searchQuery.set(term); // Update UI immediately
        this.searchSubject.next(term); // Debounce URL update
    }

    applyFilter(type: string, value: any) {
        const queryParams: any = { _page: 1 }; // Reset page on filter change
        queryParams[type] = value === 'all' ? null : value;
        
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams,
            queryParamsHandling: 'merge'
        });
    }

    openQuickView(product: Product) {
        this.quickViewProduct.set(product);
        this.isQuickViewOpen.set(true);
    }

    closeQuickView() {
        this.isQuickViewOpen.set(false);
        this.quickViewProduct.set(null);
    }

    addToCart(product: Product) {
        this.cartService.addToCart(product);
        this.closeQuickView();
    }

    async loadCategories() {
        this.categoryService.getData({ _page: 1, _per_page: 500 }).subscribe(res => {
            const allCategories = res.data;
            this.categories.set(allCategories);

            // Heuristic Strategy
            const keywords = [
                'repuesto', 'modulo', 'módulo', 'bateria', 'batería', 'display', 'screen', 'pantalla', 
                'glass', 'tapa', 'flex', 'pin', 'carga', 'auricular', 'microfono', 'micrófono', 
                'camara', 'cámara', 'lente', 'touch', 'vidrio', 'bandeja', 'sim', 'buzzer', 'speaker', 
                'altavoz', 'parlante', 'vibrador', 'sensor', 'boton', 'tecla', 'home', 'volumen', 'power'
            ];
            
            const relevantCategories = allCategories.filter(c => 
                keywords.some(k => c.name.toLowerCase().includes(k) || c.slug.toLowerCase().includes(k))
            );

            let repuestosCat = allCategories.find(c => c.slug.toLowerCase() === 'repuestos');
            if (!repuestosCat && relevantCategories.length > 0) repuestosCat = relevantCategories[0];

            if (relevantCategories.length > 0) {
                let allIds = new Set<string>();
                relevantCategories.forEach(cat => {
                    allIds.add(cat.id);
                    const treeIds = this.getAllChildIds(cat.id, allCategories);
                    treeIds.forEach(id => allIds.add(id));
                });

                this.repuestosRootId.set(repuestosCat?.id || null);
                this.repuestosCategoryIds.set(Array.from(allIds));
                this.isInitialized.set(true);
                this.productsRs.reload(); // Trigger stream now that we have categories
            } else {
                 this.initError.set('No se encontraron categorías de repuestos.');
                 this.isInitialized.set(true); 
            }
        });
    }

    async loadBrands() {
        const brands = await this.brandRepo.findAll({ column: 'name', ascending: true });
        this.brands.set(brands);
    }

    getAllChildIds(parentId: string, allCategories: iCategory[]): string[] {
        let ids = [parentId];
        const children = allCategories.filter(c => c.parent_id === parentId);
        children.forEach(child => {
            ids = [...ids, ...this.getAllChildIds(child.id, allCategories)];
        });
        return ids;
    }
}
