import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { rxResource, toObservable } from '@angular/core/rxjs-interop';
import { map, switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject, combineLatest, of } from 'rxjs';
import { TenantService } from '@app/core/services/tenant.service';

import { ProductService } from '@app/public/products/services';
import { CartService } from '@app/shared/services/cart.service';
import { PaginationService, iPagination } from '@app/shared/components/pagination';
import { ProductsGridComponent } from '@app/public/products/components';
import { BreadcrumbsComponent, BreadcrumbItem } from '@app/shared/components/breadcrumbs/breadcrumbs.component';
import { Product } from '@app/public/products/interfaces';
import { GsmService } from '@app/public/gsm/services/gsm.service';

@Component({
  selector: 'app-products-all-page',
  standalone: true,
  imports: [
    ProductsGridComponent,
    RouterModule,
    FormsModule,
    CommonModule,
    BreadcrumbsComponent
  ],
  templateUrl: './products-all-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsAllPage {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private productService: ProductService = inject(ProductService);
  public paginationService: PaginationService = inject(PaginationService);
  public cartService: CartService = inject(CartService);
  private tenantService = inject(TenantService);
  private tenant$ = toObservable(this.tenantService.currentTenant);

  // Search Signal and Subject for debounce
  searchQuery = signal('');
  private searchSubject = new Subject<string>();

  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Inicio', url: '/' },
    { label: 'Productos' }
  ]);

  // Filter signals
  minPriceInput = signal<number | null>(null);
  maxPriceInput = signal<number | null>(null);
  currentSort = 'created_at|desc';

  constructor() {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(q => {
      this.updateQueryParams({ q: q || null, _page: 1 });
    });
  }

  productsRs = rxResource({
    stream: () => combineLatest([
      this.route.queryParams,
      this.tenant$,
    ]).pipe(
      switchMap(([params, tenant]) => {
        if (!tenant) {
          return of({
            first: 1, prev: undefined, next: undefined, last: 1, pages: 1, items: 0, data: [],
          });
        }
        const currentPage = +params['_page'] || 1;
        const _sort = params['_sort'];
        const _order = params['_order'] as 'asc' | 'desc';
        const min_price = params['min_price'] ? +params['min_price'] : undefined;
        const max_price = params['max_price'] ? +params['max_price'] : undefined;
        const q = params['q'] || undefined;

        // Sync local signals with URL params (useful for direct URL access)
        if (this.searchQuery() !== (q || '')) this.searchQuery.set(q || '');
        if (this.minPriceInput() === null && min_price) this.minPriceInput.set(min_price);
        if (this.maxPriceInput() === null && max_price) this.maxPriceInput.set(max_price);

        return this.productService.getData({
          _page: currentPage,
          _per_page: 24,
          _sort,
          _order,
          min_price,
          max_price,
          q
        });
      })
    )
  });

  displayProducts = computed<Product[]>(() => {
    const res = this.productsRs.value();
    if (!res || !res.data) return [];
    const rate = this.usdRate.value() || 1240;
    return res.data.map(p => {
      if (p.currency === 'USD') {
        return {
          ...p,
          convertedPrice: p.price * rate
        };
      }
      return p;
    });
  });

  paginationData = computed<iPagination | null>(() => {
    const data = this.productsRs.value();
    if (!data) return null;
    const { data: products, ...pagination } = data;
    return pagination as iPagination;
  });

  // UI States
  isMobileFiltersOpen = signal(false);
  isQuickViewOpen = signal(false);
  quickViewProduct = signal<Product | null>(null);

  // Methods
  onSearch(value: string) {
    this.searchQuery.set(value);
    this.searchSubject.next(value);
  }

  updateQueryParams(newParams: Record<string, string | number | null>) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: newParams,
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

  applyPriceFilter() {
    this.updateQueryParams({
      min_price: this.minPriceInput(),
      max_price: this.maxPriceInput(),
      _page: 1
    });
    this.isMobileFiltersOpen.set(false);
  }

  setSort(sort: string, order: string = 'asc') {
    this.updateQueryParams({
      _sort: sort,
      _order: order,
      _page: 1
    });
  }

  clearAllFilters() {
    this.searchQuery.set('');
    this.minPriceInput.set(null);
    this.maxPriceInput.set(null);
    this.updateQueryParams({
      q: null,
      min_price: null,
      max_price: null,
      _page: 1
    });
  }
}
