import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Injector,
  signal,
  DOCUMENT,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { combineLatest, map, switchMap, of } from 'rxjs';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Location, NgOptimizedImage, CommonModule, DecimalPipe } from '@angular/common';
import { environment } from '@env/environment';
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
import { iCategory } from '@app/public/categories/interfaces';
import { CartService } from '@app/shared/services/cart.service';
import { FallbackService } from '@app/core/services/fallback.service';
import { SeoService } from '@app/core/services/seo.service';
import { FavoritesService } from '@app/shared/services/favorites.service';
import { AuthService } from '@app/core/services/auth.service';
import { TenantService } from '@app/core/services/tenant.service';
import { ProductReviewBaseRepository } from '@app/features/products/domain/repositories/product-review.repository';
import { NotificationService } from '@app/core/services/notification.service';
import { ProductStrategicService } from '@app/core/services/product-strategic.service';
import { ShippingService, ShippingQuote } from '@app/features/orders/application/services/shipping.service';
import { GsmService } from '@app/public/gsm/services/gsm.service';
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
  public router: Router = inject(Router);

  private fallbackService = inject(FallbackService);
  private seoService = inject(SeoService);
  private document = inject(DOCUMENT);
  private authService = inject(AuthService);
  private tenantService = inject(TenantService);
  private notificationService = inject(NotificationService);
  private reviewRepository = inject(ProductReviewBaseRepository);
  private destroyRef = inject(DestroyRef);
  private strategicService = inject(ProductStrategicService);
  private shippingService = inject(ShippingService);
  private gsmService = inject(GsmService);

  // Exchange rate resource
  usdRate = rxResource({
    stream: () => this.gsmService.getUsdtRate()
  });

  // UI Constants
  starRating = [1, 2, 3, 4, 5];

  // Reviews
  reviews = signal<any[]>([]);
  newReview = signal({ name: '', comment: '', rating: 5 });
  isSubmittingReview = signal(false);

  // Auth-aware state (Reactive to support login on same page without refresh)
  authState = toSignal(this.authService.authState$);

  isLoggedIn = computed(() => !!this.authState()?.user);
  
  currentUserName = computed(() => {
    const profile = this.authState()?.profile;
    if (profile) {
      return profile.full_name || profile.display_name || 
             [profile.first_name, profile.last_name].filter(Boolean).join(' ') ||
             profile.email?.split('@')[0] || '';
    }
    return '';
  });


  // Shipping Calculator
  postalCode = signal('');
  shippingQuote = signal<ShippingQuote | null>(null);
  isCalculatingShipping = signal(false);

  calculateShipping() {
    const cp = this.postalCode();
    const product = this.product();
    
    if (cp && cp.length === 4 && product) {
      this.isCalculatingShipping.set(true);
      this.shippingService.calculateShipping(cp, product.price).subscribe({
        next: (quote) => {
          this.shippingQuote.set(quote);
          this.isCalculatingShipping.set(false);
        },
        error: () => {
          this.shippingQuote.set(null);
          this.isCalculatingShipping.set(false);
        }
      });
    }
  }

  loadReviews(productId: string) {
      this.reviewRepository.getByProductId(productId)
         .then(data => {
             if (data) this.reviews.set(data);
         })
         .catch(err => console.error("Error loading reviews:", err));
  }

  async submitReview() {
      const product = this.product();
      if (!product) return;
      if (this.isSubmittingReview()) return;

      const reviewData = this.newReview();
      // Use authenticated user name if available, otherwise use the form input
      const userName = this.isLoggedIn() ? this.currentUserName() : reviewData.name;
      
      if (!userName || !reviewData.comment) {
          this.notificationService.showWarning("Por favor completa tu nombre y comentario.");
          return;
      }

      this.isSubmittingReview.set(true);
      
      const { error } = await this.reviewRepository.create({
          tenant_id: this.tenantService.getTenantId(),
          product_id: product.id,
          user_name: userName,
          comment: reviewData.comment,
          rating: reviewData.rating
      });

      this.isSubmittingReview.set(false);

      if (error) {
          console.error("Error submitting review:", error);
          this.notificationService.showError("Ocurrió un error al enviar el comentario.");
      } else {
          this.newReview.set({ name: '', comment: '', rating: 5 });
          this.loadReviews(product.id);
          this.notificationService.showSuccess("¡Gracias por tu comentario! Será revisado pronto.");
      }
  }

  async markReviewHelpful(reviewId: string) {
      if (!reviewId) return;
      try {
          await this.reviewRepository.incrementHelpful(reviewId);
          this.reviews.update(list =>
              list.map(r => r.id === reviewId ? { ...r, helpful_count: (r.helpful_count || 0) + 1 } : r)
          );
          this.notificationService.showSuccess("¡Gracias! Marcaste esta opinión como útil.");
      } catch (err: any) {
          console.error("Error marking review as helpful:", err);
          this.notificationService.showError("No se pudo registrar tu voto.");
      }
  }



  /**
   * Hierarchical breadcrumbs for the product detail page.
   * Example: Inicio > Productos > Repuestos > Módulos > Módulo Huawei P30 Lite OLED
   * Uses the ancestor chain loaded by categoryRs.
   */
  breadcrumbItems = computed(() => {
    const product = this.product();
    const { category, ancestorChain } = this.categoryRs.value() ?? {};
    const items: BreadcrumbItem[] = [
      { label: 'Inicio', url: '/' },
      { label: 'Productos', url: '/productos' },
    ];

    // Build clickable path for every ancestor in rootâ†’leaf order
    if (ancestorChain && ancestorChain.length > 0) {
      ancestorChain.forEach((cat, idx) => {
        const slugPath = ancestorChain
          .slice(0, idx + 1)
          .map(c => c.slug)
          .join('/');
        const isLeaf = idx === ancestorChain.length - 1;
        items.push({
          label: cat.name,
          url: `/productos/categoria/${slugPath}`,
        });
        // If this IS the leaf category, it stays clickable (user can go back)
      });
    } else if (category) {
      // Fallback: single-level category (no parent)
      items.push({ label: category.name, url: `/productos/categoria/${category.slug}` });
    }

    if (product) {
      items.push({ label: product.name }); // Current page â€” no link
    }

    return items;
  });

  productRs = rxResource({
    stream: () =>
      this.route.data.pipe(
        map(data => {
          const productToUse = data['productData'];
          if (!productToUse) {
            this.router.navigate(['/404'], { skipLocationChange: true });
            return {
              data: [],
              items: 0,
              pages: 0,
              first: 0,
              last: 0,
              prev: undefined,
              next: undefined
            } as ProductsResponse;
          }
          
          // Note: SEO is already set by the product-seo.resolver.ts
          // We can optionally call updateSeoTags here again for client-side navigation
          this.updateSeoTags(productToUse);

          return {
            data: [productToUse],
            items: 1,
            pages: 1,
            first: 1,
            last: 1,
            prev: undefined,
            next: undefined
          } as ProductsResponse;
        })
      ),
  });

  // Computed para obtener el producto individual
  product = computed<Product | null>(() => {
    const data = this.productRs.value();
    if (!data || !data.data || data.data.length === 0) return null;

    // Retornar el primer producto encontrado (debería ser único por slug)
    const p = { ...data.data[0] };
    
    // Fix relative Supabase storage URLs for images
    if (p.image_url && !p.image_url.startsWith('http') && p.image_url !== '_' && p.image_url !== 'null' && !p.image_url.startsWith('assets/')) {
        const encodedPath = p.image_url.split('/').map((s: string) => encodeURIComponent(s)).join('/');
        p.image_url = `${environment.supabaseUrl}/storage/v1/object/public/public-assets/${encodedPath}`;
    }
    if (p.og_image && !p.og_image.startsWith('http') && p.og_image !== '_' && p.og_image !== 'null' && !p.og_image.startsWith('assets/')) {
        const encodedPath = p.og_image.split('/').map((s: string) => encodeURIComponent(s)).join('/');
        p.og_image = `${environment.supabaseUrl}/storage/v1/object/public/public-assets/${encodedPath}`;
    }
    if (p.gallery_urls && p.gallery_urls.length > 0) {
        p.gallery_urls = p.gallery_urls.map((img: string) => {
            if (img && !img.startsWith('http') && img !== '_' && img !== 'null' && !img.startsWith('assets/')) {
                const encodedPath = img.split('/').map((s: string) => encodeURIComponent(s)).join('/');
                return `${environment.supabaseUrl}/storage/v1/object/public/public-assets/${encodedPath}`;
            }
            return img;
        });
    }

    const rate = this.usdRate.value() || 1240;
    if (p.currency === 'USD') {
      return {
        ...p,
        convertedPrice: p.price * rate
      };
    }
    return p;
  });

  // Strategic Computeds
  showPriceAndBuy = computed(() => {
      const p = this.product();
      this.authState(); // Track auth state for reactivity
      return p ? this.strategicService.canViewPriceAndBuy(p) : false;
  });


  valueProposition = computed(() => {
      const p = this.product();
      return p ? this.strategicService.getValueProposition(p) : '';
  });

  showWishlist = computed(() => {
      const p = this.product();
      return p ? this.strategicService.canShowWishlist(p) : false;
  });

  // Signal for the currently selected image to display
  selectedImage = signal<string | null>(null);

  updateSeoTags(product: Product) {
    // ── SEO / Open Graph / WhatsApp ──────────────────────────────────
    let absoluteImageUrl = product.og_image || product.image_url || '';
    
    // Validation: Ensure we don't use detail pages OR non-images as OG images
    const isRecursive = absoluteImageUrl.includes('/detalle/') || absoluteImageUrl.includes('/posts/');

    // Fix relative Supabase storage URLs for images
    if (absoluteImageUrl && !absoluteImageUrl.startsWith('http') && absoluteImageUrl !== '_' && absoluteImageUrl !== 'null' && !absoluteImageUrl.startsWith('assets/')) {
        const encodedPath = absoluteImageUrl.split('/').map((s: string) => encodeURIComponent(s)).join('/');
        absoluteImageUrl = `${environment.supabaseUrl}/storage/v1/object/public/public-assets/${encodedPath}`;
    }

    if (!absoluteImageUrl || isRecursive) {
      absoluteImageUrl = `assets/img/branding/inicio.jpg`;
    }

    const defaultDescription = product.description
      ? product.description.slice(0, 155) + (product.description.length > 155 ? '...' : '')
      : `Comprá ${product.name} al mejor precio en Arecofix. Stock disponible con garantía.`;
      
    const productDescription = product.meta_description || defaultDescription;
    const productTitle = product.meta_title || product.name;

    const nameKeywords = product.name
      .toLowerCase()
      .replace(/[^a-z0-9áéíóúñ ]/g, '')
      .split(' ')
      .filter(w => w.length > 3)
      .join(', ');

    // Set all standard + social meta tags via SeoService
    this.seoService.setPageData({
      title: productTitle,
      description: productDescription,
      imageUrl: absoluteImageUrl,
      type: 'product',
      url: `/productos/detalle/${product.slug}`,
      keywords: `repuesto, módulo, pantalla, repair, arecofix, ${nameKeywords}`,
      twitterCard: 'summary_large_image',
    });
    // â”€â”€ JSON-LD Product Schema â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    this.injectProductSchema(product, absoluteImageUrl);
  }

  constructor() {
    toObservable(this.product, { injector: this.injector }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(product => {
      if (!product) return;

      // Initialize selected image on first load
      if (!this.selectedImage()) {
        this.selectedImage.set(product.image_url || null);
      }

      this.loadReviews(product.id);
    });
  }

  /**
   * Injects the JSON-LD Product schema for Google rich results.
   * Uses a stable script ID so it replaces itself on navigation.
   */
  private injectProductSchema(product: Product, imageUrl: string): void {
    const scriptId = 'product-json-ld';
    let script = this.document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }

    script.text = JSON.stringify({
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: product.name,
      image: [imageUrl],
      description: product.description || `Comprá ${product.name} en Arecofix`,
      brand: { '@type': 'Brand', name: 'Arecofix' },
      sku: product.sku || product.id,
      offers: {
        '@type': 'Offer',
        url: `https://arecofix.com.ar/productos/detalle/${product.slug}`,
        priceCurrency: 'ARS',
        price: product.price,
        availability: (product.stock ?? 1) > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        seller: { '@type': 'Organization', name: 'Arecofix' },
      },
    });
  }

  selectImage(image: string) {
      this.selectedImage.set(image);
  }

  private injector = inject(Injector);

  /**
   * Loads the product's direct category AND its full ancestor chain.
   * Returns { category, ancestorChain } so breadcrumbs can build the
   * complete path: Inicio > Productos > Repuestos > Módulos > [product]
   */
  categoryRs = rxResource({
    stream: () => toObservable(this.product, { injector: this.injector }).pipe(
      switchMap(product => {
        if (!product?.category_id) return of(null);
        return combineLatest({
          category: this.categoryService.getById(product.category_id.toString()),
          allCategories: this.categoryService.getAll(),
        }).pipe(
          map(({ category, allCategories }) => {
            if (!category) return null;
            const ancestorChain = this.categoryService.buildAncestorChain(
              category.id,
              allCategories
            );
            return { category, ancestorChain };
          })
        );
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

}

export default ProductsDetailsPage;
