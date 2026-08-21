import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProductService } from '@app/public/products/services';
import { SeoService } from '@app/core/services/seo.service';
import { FallbackService } from '@app/core/services/fallback.service';
import { Product } from '@app/public/products/interfaces';
import { map, catchError, of, tap } from 'rxjs';
import { environment } from '@env/environment';

export const productSeoResolver: ResolveFn<Product | null> = (route, state) => {
  const productService = inject(ProductService);
  const seoService = inject(SeoService);
  const fallbackService = inject(FallbackService);

  const slug = route.paramMap.get('productSlug');
  if (!slug) return of(null);

  return productService.getData({ _page: 1, slug: slug }).pipe(
    map(response => {
      let product = response.data && response.data.length > 0 ? response.data[0] : null;
      if (!product) {
        product = fallbackService.getFallbackProduct(slug) || null;
      }
      return product;
    }),
    tap(product => {
      if (product) {
        const defaultDescription = product.description
          ? product.description.slice(0, 155) + (product.description.length > 155 ? '...' : '')
          : `Comprá ${product.name} al mejor precio en Arecofix. Stock disponible con garantía.`;
          
        const productDescription = product.meta_description || defaultDescription;
        const productTitle = product.meta_title || product.name;

        let absoluteImageUrl = product.og_image || product.image_url || '';
        const isRecursive = absoluteImageUrl.includes('/detalle/') || absoluteImageUrl.includes('/posts/');

        if (absoluteImageUrl && !absoluteImageUrl.startsWith('http') && absoluteImageUrl !== '_' && absoluteImageUrl !== 'null' && !absoluteImageUrl.startsWith('assets/')) {
            const encodedPath = absoluteImageUrl.split('/').map((s: string) => encodeURIComponent(s)).join('/');
            absoluteImageUrl = `${environment.supabaseUrl}/storage/v1/object/public/public-assets/${encodedPath}`;
        }

        if (!absoluteImageUrl || isRecursive) {
          absoluteImageUrl = `assets/img/branding/inicio.jpg`;
        }

        const nameKeywords = product.name
          .toLowerCase()
          .replace(/[^a-z0-9áéíóúñ ]/g, '')
          .split(' ')
          .filter(w => w.length > 3)
          .join(', ');

        seoService.setPageData({
          title: productTitle,
          description: productDescription,
          imageUrl: absoluteImageUrl,
          type: 'product',
          url: `/productos/detalle/${product.slug}`,
          keywords: `repuesto, módulo, pantalla, repair, arecofix, ${nameKeywords}`,
          twitterCard: 'summary_large_image',
          schema: {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "image": absoluteImageUrl,
            "description": productDescription,
            "sku": product.sku || product.id,
            "brand": {
              "@type": "Brand",
              "name": "Arecofix"
            },
            "offers": {
              "@type": "Offer",
              "url": `https://arecofix.com.ar/productos/detalle/${product.slug}`,
              "priceCurrency": "ARS",
              "price": product.price,
              "availability": (product.stock ?? 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              "itemCondition": "https://schema.org/NewCondition"
            }
          }
        });
      }
    }),
    catchError(() => of(null))
  );
};
