import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Injector,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { combineLatest, map, switchMap, of } from 'rxjs';
import { rxResource, toObservable } from '@angular/core/rxjs-interop';
import { Location, NgOptimizedImage } from '@angular/common';
/*  */
import {
  IsEmptyComponent,
  IsErrorComponent,
  IsLoadingComponent,
} from '@app/shared/components/resource-status';
/*  */
import { CategoryService } from '@app/public/categories/services';
import { ProductService } from '@app/public/products/services';
import { Product } from '../../interfaces';
import { CartService } from '@app/shared/services/cart.service';
import { FallbackService } from '@app/core/services/fallback.service';
import { SeoService } from '@app/core/services/seo.service';
/*  */

@Component({
  selector: 'app-products-details-page',
  imports: [
    IsEmptyComponent,
    IsErrorComponent,
    IsLoadingComponent,
    NgOptimizedImage,
    FormsModule,
    RouterModule
  ],
  templateUrl: './products-details-page.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsDetailsPage {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private categoryService: CategoryService = inject(CategoryService);
  private productService: ProductService = inject(ProductService);
  private location: Location = inject(Location);

  private fallbackService = inject(FallbackService);
  private seoService = inject(SeoService);

  constructor() {
      effect(() => {
          const product = this.product();
          if (product) {
              this.seoService.setPageData(
                  product.name,
                  product.description || `Compra ${product.name} en Arecofix`,
                  product.image_url
              );
          }
      });
  }

  productRs = rxResource({
    stream: () =>
      combineLatest([
        this.route.params.pipe(map(({ productSlug }) => productSlug)),
        this.route.queryParams.pipe(map((params) => +params['_page'] || 1)),
      ]).pipe(
        switchMap(([slug]) => {
          return this.productService.getData({
            _page: 1,
            slug: slug,
          }).pipe(
            map(response => {
              const fallbackItem = this.fallbackService.getFallbackProduct(slug);

              if ((!response.data || response.data.length === 0) && fallbackItem) {
                // Return fallback item if DB empty and we have a fallback
                return {
                  ...response,
                  data: [fallbackItem],
                  items: 1,
                  pages: 1
                } as any;
              }
              return response;
            })
          );
        })
      ),
  });

  // Computed para obtener el producto individual
  product = computed<Product | null>(() => {
    const data = this.productRs.value();
    if (!data || !data.data || data.data.length === 0) return null;

    // Retornar el primer producto encontrado (debería ser único por slug)
    return data.data[0];
  });

  private injector = inject(Injector);

  categoryRs = rxResource({
    stream: () => toObservable(this.product, { injector: this.injector }).pipe(
      switchMap(product => {
        if (!product) return of(null);
        return this.categoryService.getById(product.category_id);
      })
    )
  });

  // Método para volver atrás
  goBack(): void {
    this.location.back();
  }

  private cartService = inject(CartService);

  addToCart() {
    const product = this.product();
    if (product) {
      this.cartService.addToCart(product);
    }
  }

  shareProduct() {
      // ... same share logic ...
      const product = this.product();
      if (!product) return;
  
      const shareData = {
        title: product.name,
        text: `Mira este producto: ${product.name}`,
        url: window.location.href
      };
  
      if (navigator.share) {
        navigator.share(shareData)
          .catch((err) => console.error('Error sharing:', err));
      } else {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href)
          .then(() => alert('Enlace copiado al portapapeles!'))
          .catch(err => console.error('Error copying to clipboard:', err));
      }
  }

  searchQuery = '';
  private router = inject(Router);

  onSearch() {
    if (this.searchQuery.trim()) {
        this.router.navigate(['/products/all'], { queryParams: { q: this.searchQuery } });
    }
  }
}

export default ProductsDetailsPage;
