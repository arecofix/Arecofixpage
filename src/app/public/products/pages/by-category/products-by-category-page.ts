import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, switchMap, of, tap } from 'rxjs';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';

/*  */
import {
  IsErrorComponent,
  IsLoadingComponent,
} from '@app/shared/components/resource-status';
/*  */
import { CategoryService } from '@app/public/categories/services';
import { ProductService } from '@app/public/products/services';
import {
  iCategoriesResponse,
  iCategory,
  iRequestParams,
} from '@app/public/categories/interfaces';
import {
  Pagination,
  PaginationService,
  iPagination,
} from '@app/shared/components/pagination';
import { ProductCard } from '@app/public/products/components';

/*  */
@Component({
  selector: 'products-by-category-page',
  imports: [
    IsErrorComponent,
    IsLoadingComponent,
    ProductCard,
    Pagination
],
  templateUrl: './products-by-category-page.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsByCategoryPage {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private categoryService: CategoryService = inject(CategoryService);
  private productService: ProductService = inject(ProductService);
  public paginationService: PaginationService = inject(PaginationService);

  public currentCategory = signal<iCategory | null>(null);

  productsRs = rxResource({
    stream: () =>
      combineLatest([
        this.route.params.pipe(map(({ categorySlug }) => categorySlug)),
        this.route.queryParams.pipe(map((params) => +params['_page'] || 1)),
      ]).pipe(
        switchMap(([slug, currentPage]) =>
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

              return this.productService.getData({
                category_id: categoryId,
                _page: currentPage,
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
}
export default ProductsByCategoryPage;
