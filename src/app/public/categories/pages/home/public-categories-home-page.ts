import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource, toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, switchMap, of } from 'rxjs';

/*  */
import { Pagination, PaginationService, iPagination } from '@app/shared/components/pagination';
import { CategoryService } from '@app/public/categories/services';
import {
  IsEmptyComponent,
  IsErrorComponent,
  IsLoadingComponent,
} from '@app/shared/components/resource-status';
import { PublicCategoryCard } from './components/';
import { SeoService } from '@app/core/services/seo.service';
import { TenantService } from '@app/core/services/tenant.service';

@Component({
  selector: 'app-public-categories-home-page',
  imports: [
    IsEmptyComponent,
    IsErrorComponent,
    IsLoadingComponent,
    PublicCategoryCard,
    Pagination,
  ],
  templateUrl: './public-categories-home-page.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicCategoriesHomePage {
  private route: ActivatedRoute = inject(ActivatedRoute);
  public paginationService: PaginationService = inject(PaginationService);
  private categoryService: CategoryService = inject(CategoryService);
  private tenantService = inject(TenantService);
  private tenant$ = toObservable(this.tenantService.currentTenant);

  categoriesRs = rxResource({
    stream: () =>
      combineLatest([
        this.route.queryParams.pipe(map((params) => +params['_page'] || 1)),
        this.tenant$,
      ]).pipe(
        switchMap(([currentPage, tenant]) => {
          if (!tenant) return of({ first: 1, prev: null, next: null, last: 1, pages: 1, items: 0, data: [] });
          return this.categoryService.getData({
            _page: currentPage,
            _per_page: 5,
          });
        })
      ),
  });

  paginationData = computed<iPagination | null>(() => {
    const data = this.categoriesRs.value();
    if (!data) return null;

    const { data: items, ...pagination } = data;
    return pagination as iPagination;
  });

  /** âœ… NUEVO: Computed con categorías filtradas */
  filteredCategories = computed(() => {
    const res = this.categoriesRs.value();
    if (!res) return [];

    const slugsToExclude = ['sports', 'deportes', 'music', 'música', 'clothing', 'ropa', "home-garden", 'hogar-jardín', 'automotive', 'automoviles', 'toys', 'juguetes', 'health-beauty', 'salud-belleza', 'food-drinks', 'comida-bebidas'];
   return res.data.filter(
      (category) => !slugsToExclude.includes(category.slug.toLowerCase())
    );
  });

  private seoService = inject(SeoService);

  constructor() {
    this.setSEO();
  }

  private setSEO() {
    const description = 'Explorá nuestro catálogo de productos organizado por categorías: Repuestos, Herramientas, Celulares y más.';
    const imageUrl = 'assets/img/branding/inicio.jpg';

    
  }
}

export default PublicCategoriesHomePage;
