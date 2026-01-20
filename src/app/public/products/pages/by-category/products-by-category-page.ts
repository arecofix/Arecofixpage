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
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { rxResource } from '@angular/core/rxjs-interop';

import {
  IsErrorComponent,
} from '@app/shared/components/resource-status';
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

@Component({
  selector: 'products-by-category-page',
  imports: [
    CommonModule,
    IsErrorComponent,
    ProductCard,
    Pagination,
    RouterModule,
    FormsModule
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
  updateQueryParams(newParams: any) {
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

  productsRs = rxResource({
    stream: () =>
      combineLatest([
        this.route.params.pipe(map(({ categorySlug }) => categorySlug)),
        this.route.queryParams,
      ]).pipe(
        switchMap(([slug, params]) =>
          this.categoryService.getDataBySlug(slug).pipe(
            tap((category: iCategoriesResponse) => {
              this.currentCategory.set(category.data?.[0] || null);
            }),
            switchMap((category: iCategoriesResponse) => {
              const categoryId = category.data?.[0]?.id;
              
              if (!categoryId) {
                return of({
                  first: 1, prev: null, next: null, last: 1, pages: 1, items: 0, data: []
                });
              }

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
                category_id: categoryId,
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
  public quickViewProduct = signal<any>(null);

  // Methods
  toggleMobileFilters() {
    this.isMobileFiltersOpen.update(v => !v);
  }

  openQuickView(product: any) {
    this.quickViewProduct.set(product);
    this.isQuickViewOpen.set(true);
  }

  closeQuickView() {
    this.isQuickViewOpen.set(false);
    this.quickViewProduct.set(null);
  }

  addToCart(product: any) {
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
