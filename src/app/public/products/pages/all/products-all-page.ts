import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { IsErrorComponent } from '@app/shared/components/resource-status';
import { ProductService } from '@app/public/products/services';
import { CartService } from '@app/shared/services/cart.service';
import { Pagination, PaginationService, iPagination } from '@app/shared/components/pagination';
import { ProductCard } from '@app/public/products/components';
import { BreadcrumbsComponent, BreadcrumbItem } from '@app/shared/components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-products-all-page',
  standalone: true,
  imports: [
    IsErrorComponent,
    ProductCard,
    Pagination,
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
    stream: () => this.route.queryParams.pipe(
      switchMap(params => {
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
          _sort,
          _order,
          min_price,
          max_price,
          q
        });
      })
    )
  });

  paginationData = computed<iPagination | null>(() => {
    const data = this.productsRs.value();
    if (!data) return null;
    const { data: products, ...pagination } = data;
    return pagination as iPagination;
  });

  // UI States
  isQuickViewOpen = signal(false);
  quickViewProduct = signal<any>(null);

  // Methods
  onSearch(value: string) {
    this.searchQuery.set(value);
    this.searchSubject.next(value);
  }

  updateQueryParams(newParams: any) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: newParams,
      queryParamsHandling: 'merge'
    });
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
    this.updateQueryParams({
      min_price: this.minPriceInput(),
      max_price: this.maxPriceInput(),
      _page: 1
    });
  }

  setSort(sort: string, order: string = 'asc') {
    this.updateQueryParams({
      _sort: sort,
      _order: order,
      _page: 1
    });
  }
}
