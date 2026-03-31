import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { combineLatest, map, switchMap, of, tap, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators';
import { rxResource } from '@angular/core/rxjs-interop';
import { SeoService } from '@app/core/services/seo.service';

import {
  IsErrorComponent,
} from '@app/shared/components/resource-status';
import { BreadcrumbsComponent, BreadcrumbItem } from '@app/shared/components/breadcrumbs/breadcrumbs.component';
import { CategoryService } from '@app/public/categories/services';
import { ProductService } from '@app/public/products/services';
import { iCategory } from '@app/public/categories/interfaces';
import { CartService } from '@app/shared/services/cart.service';
import {
  Pagination,
  PaginationService,
  iPagination,
} from '@app/shared/components/pagination';
import { ProductCard } from '@app/public/products/components';
import { Product } from '@app/public/products/interfaces';

@Component({
  selector: 'products-by-category-page',
  imports: [
    CommonModule,
    IsErrorComponent,
    ProductCard,
    Pagination,
    RouterModule,
    FormsModule,
    BreadcrumbsComponent
  ],
  templateUrl: './products-by-category-page.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsByCategoryPage {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private categoryService: CategoryService = inject(CategoryService);
  private productService: ProductService = inject(ProductService);
  public paginationService: PaginationService = inject(PaginationService);
  public cartService: CartService = inject(CartService);
  private seoService: SeoService = inject(SeoService);

  public currentCategory = signal<iCategory | null>(null);
  /** Stores the full ancestor chain (root → ... → current) for hierarchical breadcrumbs */
  private ancestorChain = signal<iCategory[]>([]);

  // Filter signals to bind to UI inputs
  minPriceInput = signal<number | null>(null);
  maxPriceInput = signal<number | null>(null);

  categoriesListRs = rxResource({
    stream: () => this.categoryService.getFeaturedData()
  });

  /**
   * Builds hierarchical breadcrumbs dynamically.
   * Example: Inicio > Productos > Repuestos > Módulos
   * Each ancestor gets a clickable URL; the current category is the terminal item.
   */
  breadcrumbItems = computed(() => {
    const chain = this.ancestorChain();
    const items: BreadcrumbItem[] = [
      { label: 'Inicio', url: '/' },
      { label: 'Productos', url: '/productos' },
    ];

    if (chain.length === 0) {
      // Fallback while data loads
      items.push({ label: 'Categoría' });
      return items;
    }

    // Build the hierarchical slug path for each ancestor
    // e.g., chain = [repuestos, modulos] → /productos/categoria/repuestos, /productos/categoria/repuestos/modulos
    chain.forEach((cat, idx) => {
      const slugPath = chain
        .slice(0, idx + 1)
        .map(c => c.slug)
        .join('/');
      const isLast = idx === chain.length - 1;
      items.push({
        label: cat.name,
        url: isLast ? undefined : `/productos/categoria/${slugPath}`,
      });
    });

    return items;
  });

  // Search Signal and Subject
  searchQuery = signal('');
  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(q => {
      this.updateQueryParams({ q: q || null, _page: 1 });
    });
  }

  // Helper for updating query params (DRY)
  updateQueryParams(newParams: Record<string, string | number | null>) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: newParams,
      queryParamsHandling: 'merge',
    });
  }

  // Method called from template
  onSearch(value: string) {
    this.searchQuery.set(value);
    this.searchSubject.next(value);
  }

  // Helper function to get all descendant category IDs recursively
  private getAllDescendantIds(parentId: string, allCategories: iCategory[]): string[] {
      // Start with the parent itself
      let ids = [parentId];
      
      // Find direct children
      const children = allCategories.filter(c => c.parent_id === parentId);
      
      for (const child of children) {
          // Recursively add children and their descendants
          ids = [...ids, ...this.getAllDescendantIds(child.id, allCategories)];
      }
      
      // Remove duplicates just in case (e.g. if graph has cycles, though unlikely in categories tree)
      return [...new Set(ids)];
  }

  productsRs = rxResource({
    stream: () =>
      combineLatest([
        this.route.params.pipe(map(({ categorySlug }) => categorySlug as string)),
        this.route.queryParams,
      ]).pipe(
        switchMap(([slugPath, params]) => {
          /**
           * Support for hierarchical URL paths.
           * e.g. slugPath = 'repuestos/modulos' → leaf slug = 'modulos'
           * This allows both old (/productos/categoria/modulos) and new
           * (/productos/categoria/repuestos/modulos) URLs to resolve correctly.
           */
          const leafSlug = this.categoryService.resolveSlugFromPath(slugPath || '');

          return combineLatest({
            categoryResponse: this.categoryService.getDataBySlug(leafSlug),
            allCategories: this.categoryService.getAll().pipe(catchError(() => of([]))),
          }).pipe(
            tap(({ categoryResponse, allCategories }) => {
              const cat = categoryResponse.data?.[0] || null;
              this.currentCategory.set(cat);

              // Build hierarchical ancestor chain for dynamic breadcrumbs
              if (cat && (allCategories as iCategory[]).length > 0) {
                const chain = this.categoryService.buildAncestorChain(
                  cat.id,
                  allCategories as iCategory[]
                );
                this.ancestorChain.set(chain);
                this.setSEO(cat);
              } else {
                this.ancestorChain.set(cat ? [cat] : []);
                if (cat) this.setSEO(cat);
              }
            }),
            switchMap(({ categoryResponse, allCategories }) => {
              const currentCat = categoryResponse.data?.[0];
              const categoryId = currentCat?.id;

              if (!categoryId) {
                // Silent fail for missing category slugs
                return of({
                  first: 1, prev: null, next: null, last: 1, pages: 1, items: 0, data: [],
                });
              }

              // Recursive: get all descendant IDs so /repuestos shows /modulos, /baterias, etc.
              const targetCategoryIds = this.getAllDescendantIds(
                categoryId,
                allCategories as iCategory[]
              );

              const currentPage = +params['_page'] || 1;
              const _sort = params['_sort'];
              const _order = params['_order'] as 'asc' | 'desc';
              const min_price = params['min_price'] ? +params['min_price'] : undefined;
              const max_price = params['max_price'] ? +params['max_price'] : undefined;
              const q = params['q'] || undefined;

              // Sync local filter signals with URL params
              if (this.searchQuery() !== (q || '')) this.searchQuery.set(q || '');
              if (this.minPriceInput() === null && min_price) this.minPriceInput.set(min_price);
              if (this.maxPriceInput() === null && max_price) this.maxPriceInput.set(max_price);

              return this.productService.getData({
                category_ids: targetCategoryIds,
                _page: currentPage,
                _per_page: 24,
                _sort,
                _order,
                min_price,
                max_price,
                q,
              });
            })
          );
        })
      ),
  });


  // Computed para extraer datos de paginación de forma reactiva
  paginationData = computed<iPagination | null>(() => {
    const data = this.productsRs.value();
    if (!data) return null;

    // Extraer solo los datos de paginación
    const { data: products, ...pagination } = data;
    return pagination as iPagination;
  });

  // UI States
  public isMobileFiltersOpen = signal(false);
  public isQuickViewOpen = signal(false);
  public quickViewProduct = signal<Product | null>(null);

  // Methods
  toggleMobileFilters() {
    this.isMobileFiltersOpen.update(v => !v);
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

  applyPriceFilter() {
     this.router.navigate([], {
       relativeTo: this.route,
       queryParams: {
         min_price: this.minPriceInput(),
         max_price: this.maxPriceInput(),
         _page: 1 
       },
       queryParamsHandling: 'merge', 
     });
     this.isMobileFiltersOpen.set(false);
  }

  setSort(sort: string, order: string = 'asc') {
      this.router.navigate([], {
       relativeTo: this.route,
       queryParams: {
         _sort: sort,
         _order: order,
         _page: 1
       },
       queryParamsHandling: 'merge',
     });
  }

  private setSEO(category: iCategory) {
    const description = category.description || `Explorá nuestra selección de ${category.name} en Arecofix. Calidad y mejores precios garantizados.`;
    const imageUrl = category.image_url || 'assets/img/branding/og-services.jpg';

    this.seoService.setPageData({
      title: `${category.name} | Arecofix`,
      description: description,
      imageUrl: imageUrl,
      type: 'website'
    });
    
    // Extra OG tags for WhatsApp
    this.setWhatsAppOgTags(imageUrl, description, category.name);
  }

  private setWhatsAppOgTags(imageUrl: string, description: string, categoryName: string): void {
     // Check if we are in the browser
     if (typeof document === 'undefined') return;

     const meta = document.head;
     const setOrCreate = (property: string, content: string) => {
       let el = meta.querySelector(`meta[property='${property}']`) as HTMLMetaElement;
       if (!el) {
         el = document.createElement('meta');
         el.setAttribute('property', property);
         document.head.appendChild(el);
       }
       el.setAttribute('content', content);
     };

     // Ensure absolute image URL
     const absoluteImageUrl = imageUrl.startsWith('http') 
        ? imageUrl 
        : `https://arecofix.com.ar/${imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl}`;

     setOrCreate('og:title', `${categoryName} | Arecofix`);
     setOrCreate('og:image', absoluteImageUrl);
     setOrCreate('og:image:secure_url', absoluteImageUrl);
     setOrCreate('og:image:width', '1200');
     setOrCreate('og:image:height', '630');
     setOrCreate('og:image:type', 'image/jpeg');
     setOrCreate('og:description', description);
     setOrCreate('og:site_name', 'Arecofix');
     setOrCreate('og:type', 'website');
  }
}
export default ProductsByCategoryPage;
