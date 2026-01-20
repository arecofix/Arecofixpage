import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { combineLatest, map, switchMap, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import {
  IsErrorComponent,
} from '@app/shared/components/resource-status';

import { CategoryService } from '@app/public/categories/services';
import { ProductService } from '@app/public/products/services';
import { CartService } from '@app/shared/services/cart.service';

import {
  Pagination,
  PaginationService,
  iPagination,
} from '@app/shared/components/pagination';
import { ProductCard } from '@app/public/products/components';

@Component({
  selector: 'products-featured-page',
  standalone: true,
  imports: [
    CommonModule,
    IsErrorComponent,
    ProductCard,
    Pagination,
    FormsModule,
    RouterModule
  ],
  templateUrl: './products-featured-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsFeaturedPage {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private productService: ProductService = inject(ProductService);
  public paginationService: PaginationService = inject(PaginationService);
  public cartService: CartService = inject(CartService);

  private router = inject(Router);

   // Search Signal and Subject
  searchQuery = signal('');
  private searchSubject = new Subject<string>();

  // Quick View
  isQuickViewOpen = signal(false);
  quickViewProduct = signal<any>(null);

  constructor() {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(q => {
      this.updateQueryParams({ q: q || null, _page: 1 });
    });
  }

  updateQueryParams(newParams: any) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: newParams,
      queryParamsHandling: 'merge',
    });
  }

  onSearch(value: string) {
    this.searchQuery.set(value);
    this.searchSubject.next(value);
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

  productsRs = rxResource({
    stream: () =>
      combineLatest([
        this.route.params.pipe(map(({ categorySlug }) => categorySlug)),
        this.route.queryParams
      ]).pipe(
        switchMap(([slug, params]) => {
           const currentPage = +params['_page'] || 1;
           const q = params['q'] || undefined;

           // Sync signal
           if (this.searchQuery() !== (q || '')) this.searchQuery.set(q || '');

           return this.productService.getData({
            featured: true, // Filtrar productos destacados
            _page: currentPage,
            q 
            });
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
}
export default ProductsFeaturedPage;
