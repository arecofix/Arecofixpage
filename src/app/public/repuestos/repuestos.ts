import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, map, of } from 'rxjs';
import { IsEmptyComponent, IsLoadingComponent } from '@app/shared/components/resource-status';
import { CategoryService } from '@app/public/categories/services';
import { ProductService } from '@app/public/products/services';
import { ProductsResponse } from '@app/public/products/interfaces';
import { ProductCard } from '@app/public/products/components';
import { Pagination, PaginationService, iPagination } from '@app/shared/components/pagination';
import { iCategory } from '@app/public/categories/interfaces';
import { BrandRepository } from '@app/features/products/data/repositories/brand.repository';
import { Brand } from '@app/features/products/domain/entities/brand.entity';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-repuestos',
    standalone: true,
    imports: [CommonModule, FormsModule, IsEmptyComponent, IsLoadingComponent, ProductCard, Pagination],
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

    repuestosRootId = signal<string | null>(null);

    // Visible Categories: Only direct children of Repuestos
    visibleCategories = computed(() => {
        const rootId = this.repuestosRootId();
        if (!rootId) return [];
        // If we found a root, show its children. If heuristic found multiple roots, this might be partial.
        // For UI purposes, we prefer showing categories that have the root as parent.
        return this.categories().filter(c => c.parent_id === rootId);
    });
    
    // Filter state (bound to template)
    filterState = {
        search: '',
        category: 'all',
        category_ids: [] as string[], // NEW: Store list of IDs
        brand: 'all',
        maxPrice: null as number | null,
        sort: 'relevance' as 'relevance' | 'price-asc' | 'price-desc' | 'rating-desc',
    };

    // Initialization state
    isInitialized = signal(false);
    initError = signal<string | null>(null);

    // Active filter (triggers resource)
    activeFilter = signal({ ...this.filterState });

    // Resource for products
    productsRs = rxResource({
        stream: () => {
            const f = this.activeFilter();
            const initialized = this.isInitialized();
            const page = this.paginationService.currentPage() || 1;

             // If not initialized or no categories found yet, return empty (but don't stop tracking signals)
            if (!initialized || (f.category === 'all' && (!f.category_ids || f.category_ids.length === 0))) {
                return of({ 
                    data: [], items: 0, pages: 0, first: 1, last: 1, prev: undefined, next: undefined 
                } as ProductsResponse);
            }
            
            // Build params
            const params: any = {
                _page: page,
                _per_page: 12,
            };

            if (f.search) params.name = f.search;
            
            if (f.category !== 'all') {
                 // RECURSIVE SUB-FILTERING
                 const subCatIds = this.getAllChildIds(f.category, this.categories());
                 params.category_ids = subCatIds;
            } else {
                 params.category_ids = f.category_ids;
            }

            if (f.brand !== 'all') params.brand_id = f.brand;
            if (f.maxPrice) params.price = f.maxPrice; 
            
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
        // Fetch ALL categories to ensure we have the full tree
        this.categoryService.getData({ _page: 1, _per_page: 500 }).subscribe(res => {
            const allCategories = res.data;
            this.categories.set(allCategories);
            console.log(`RepuestosPage: Loaded ${allCategories.length} categories.`);
            
            // Heuristic Strategy: Find ALL categories relevant to "Repuestos"
            // This handles cases where the DB hierarchy is flat or broken (e.g. "Módulos" is a root category).
            const keywords = [
                'repuesto', 'modulo', 'módulo', 'bateria', 'batería', 'display', 'screen', 'pantalla', 
                'glass', 'tapa', 'flex', 'pin', 'carga', 'auricular', 'microfono', 'micrófono', 
                'camara', 'cámara', 'lente', 'touch', 'vidrio', 'bandeja', 'sim', 'buzzer', 'speaker', 
                'altavoz', 'parlante', 'vibrador', 'sensor', 'boton', 'tecla', 'home', 'volumen', 'power'
            ];
            
            const relevantCategories = allCategories.filter(c => 
                keywords.some(k => c.name.toLowerCase().includes(k) || c.slug.toLowerCase().includes(k))
            );

            // Find 'Repuestos' Root for the "Root ID" reference (optional, for breadcrumbs/logic)
            // We prefer looking for exact slug 'repuestos'
            let repuestosCat = allCategories.find(c => c.slug.toLowerCase() === 'repuestos');
            
            // If not found, use the first relevant one as a proxy root (or just null)
            if (!repuestosCat && relevantCategories.length > 0) {
                repuestosCat = relevantCategories[0];
            }

            if (relevantCategories.length > 0) {
                console.log(`RepuestosPage: Heuristic found ${relevantCategories.length} relevant categories:`, relevantCategories.map(c => c.name));
                
                // Collect IDs of these categories AND their children
                let allIds = new Set<string>();
                relevantCategories.forEach(cat => {
                    // Add the category itself
                    allIds.add(cat.id);
                    // Add its children (if any)
                    const treeIds = this.getAllChildIds(cat.id, allCategories);
                    treeIds.forEach(id => allIds.add(id));
                });

                this.repuestosRootId.set(repuestosCat?.id || null);
                this.filterState.category = 'all';
                this.filterState.category_ids = Array.from(allIds);
                
                this.activeFilter.set({ ...this.filterState });
                this.isInitialized.set(true);
                
                // FORCE RELOAD: Ensure the resource wakes up now that we have data
                this.productsRs.reload();
            } else {
                 console.error('RepuestosPage: FATAL - No repuestos-related categories found via keywords!');
                 this.initError.set('No se encontraron categorías de repuestos.');
                 this.isInitialized.set(true); 
            }
        });
    }

    // Helper to get ID and all descendant IDs (Recursive)
    getAllChildIds(parentId: string, allCategories: iCategory[]): string[] {
        let ids = [parentId];
        const children = allCategories.filter(c => c.parent_id === parentId);
        
        children.forEach(child => {
            ids = [...ids, ...this.getAllChildIds(child.id, allCategories)];
        });
        
        return ids;
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
        // If user selects specific category in UI, update state. 
        // Logic in productsRs stream handles priority (specific category > list of IDs)
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
