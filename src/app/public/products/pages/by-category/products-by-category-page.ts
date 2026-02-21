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

import {
  IsErrorComponent,
} from '@app/shared/components/resource-status';
import { BreadcrumbsComponent, BreadcrumbItem } from '@app/shared/components/breadcrumbs/breadcrumbs.component';
import { CategoryService } from '@app/public/categories/services';
import { ProductService } from '@app/public/products/services';
import {
  iCategoriesResponse,
  iCategory,
} from '@app/public/categories/interfaces';
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

  public currentCategory = signal<iCategory | null>(null);

  // Filter signals to bind to UI inputs
  minPriceInput = signal<number | null>(null);
  maxPriceInput = signal<number | null>(null);

  categoriesListRs = rxResource({
    stream: () => this.categoryService.getFeaturedData()
  });

  breadcrumbItems = computed(() => {
    const category = this.currentCategory();
    const items: BreadcrumbItem[] = [
        { label: 'Inicio', url: '/' },
        { label: 'Productos', url: '/productos' }
    ];

    if (category) {
        items.push({ label: category.name });
    } else {
        items.push({ label: 'Categoría' });
    }
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
        this.route.params.pipe(map(({ categorySlug }) => categorySlug)),
        this.route.queryParams,
      ]).pipe(
        switchMap(([slug, params]) =>
          combineLatest({
            categoryResponse: this.categoryService.getDataBySlug(slug),
            allCategories: this.categoryService.getAll().pipe(catchError(() => of([])))
          }).pipe(
            tap(({ categoryResponse }) => {
              this.currentCategory.set(categoryResponse.data?.[0] || null);
            }),
            switchMap(({ categoryResponse, allCategories }) => {
              const currentCat = categoryResponse.data?.[0];
              const categoryId = currentCat?.id;
              
              if (!categoryId) {
                // Silent fail for missing category slugs rather than warning in console
                return of({
                  first: 1, prev: null, next: null, last: 1, pages: 1, items: 0, data: []
                });
              }

              // Get all descendant IDs to filter products by category AND subcategories
              const targetCategoryIds = this.getAllDescendantIds(categoryId, allCategories as iCategory[]);

              const currentPage = +params['_page'] || 1;
              const _sort = params['_sort'];
              const _order = params['_order'] as 'asc' | 'desc';
              const min_price = params['min_price'] ? +params['min_price'] : undefined;
              const max_price = params['max_price'] ? +params['max_price'] : undefined;
              const q = params['q'] || undefined; // Grab 'q'

              // Sync local signals
              if (this.searchQuery() !== (q || '')) this.searchQuery.set(q || '');
              if (this.minPriceInput() === null && min_price) this.minPriceInput.set(min_price);
              if (this.maxPriceInput() === null && max_price) this.maxPriceInput.set(max_price);

              return this.productService.getData({
                category_ids: targetCategoryIds, // Use category_ids instead of category_id
                _page: currentPage,
                _sort,
                _order,
                min_price,
                max_price,
                q // Pass 'q'
              });
            })
          )
        ) 
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
}
export default ProductsByCategoryPage;
