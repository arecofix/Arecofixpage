import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Injector,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { combineLatest, map, switchMap, of } from 'rxjs';
import { rxResource, toObservable } from '@angular/core/rxjs-interop';
import { Location, NgOptimizedImage, CommonModule, DecimalPipe, DOCUMENT } from '@angular/common';
/*  */
import {
  IsEmptyComponent,
  IsErrorComponent,
  IsLoadingComponent,
} from '@app/shared/components/resource-status';
import { BreadcrumbsComponent, BreadcrumbItem } from '@app/shared/components/breadcrumbs/breadcrumbs.component';
/*  */
import { CategoryService } from '@app/public/categories/services';
import { ProductService } from '@app/public/products/services';
import { Product, ProductsResponse } from '../../interfaces';
import { CartService } from '@app/shared/services/cart.service';
import { FallbackService } from '@app/core/services/fallback.service';
import { SeoService } from '@app/core/services/seo.service';
import { FavoritesService } from '@app/shared/services/favorites.service';
/*  */

@Component({
  selector: 'app-products-details-page',
  imports: [
    IsEmptyComponent,
    IsErrorComponent,
    IsLoadingComponent,
    NgOptimizedImage,
    FormsModule,
    RouterModule,
    BreadcrumbsComponent,
    CommonModule
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
  private document = inject(DOCUMENT);



  breadcrumbItems = computed(() => {
    const product = this.product();
    const category = this.categoryRs.value();
    const items: BreadcrumbItem[] = [
      { label: 'Inicio', url: '/' },
      { label: 'Productos', url: '/productos' }
    ];

    if (category) {
      items.push({ label: category.name, url: `/productos/categoria/${category.slug}` });
    }

    if (product) {
      items.push({ label: product.name });
    }
    return items;
  });

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
                const fallbackResponse: ProductsResponse = {
                  data: [fallbackItem],
                  items: 1,
                  pages: 1,
                  first: 1,
                  last: 1,
                  prev: undefined,
                  next: undefined
                };
                return fallbackResponse;
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

  // Signal for the currently selected image to display
  selectedImage = signal<string | null>(null);

  constructor() {
      effect(() => {
          const product = this.product();
          if (product) {
              // Initialize selected image if not set
              if (!this.selectedImage()) {
                  this.selectedImage.set(product.image_url || null);
              }

              this.seoService.setPageData({
                  title: product.name,
                  description: product.description || `Compra ${product.name} en Arecofix`,
                  imageUrl: product.image_url,
                  type: 'product'
              });

              // JSON-LD Structured Data
              const script = this.document.createElement('script');
              script.type = 'application/ld+json';
              script.text = JSON.stringify({
                "@context": "https://schema.org/",
                "@type": "Product",
                "name": product.name,
                "image": product.image_url ? [`https://arecofix.com.ar${product.image_url}`] : [],
                "description": product.description || `Compra ${product.name} en Arecofix`,
                "brand": {
                  "@type": "Brand",
                  "name": "Arecofix"
                },
                "sku": product.sku || product.id,
                "offers": {
                  "@type": "Offer",
                  "url": window.location.href,
                  "priceCurrency": "ARS",
                  "price": product.price,
                  "availability": "https://schema.org/InStock",
                  "seller": {
                    "@type": "Organization",
                    "name": "Arecofix"
                  }
                }
              });
              this.document.head.appendChild(script);
          }
      });
  }

  selectImage(image: string) {
      this.selectedImage.set(image);
  }

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

  public cartService = inject(CartService);
  public favoritesService = inject(FavoritesService);

  isFavorite = computed(() => {
    const product = this.product();
    if (!product) return false;
    return this.favoritesService.isFavorite(product.id);
  });

  toggleFavorite() {
    const product = this.product();
    if (product) {
        this.favoritesService.toggleFavorite(product);
    }
  }

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
