import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';
import { ProductsParams, ProductsResponse } from '@app/public/products/interfaces';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  totalItems?: number;
  totalPages?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsStore {
  private repository = inject(ProductRepository);

  // Cache para consultas de listas (clave: serialización de ProductsParams)
  private listCache = signal<Record<string, CacheEntry<Product[]>>>({});

  // Cache para detalles individuales (clave: productId)
  private detailCache = signal<Record<string, CacheEntry<Product>>>({});

  // Signals de estado
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  // TTL (Time To Live) de la caché: 5 minutos para listas, 3 minutos para detalles
  private readonly LIST_TTL = 5 * 60 * 1000;
  private readonly DETAIL_TTL = 3 * 60 * 1000;

  /**
   * Obtiene productos paginados con caché de Signals reactivos.
   */
  getProductsPage(params: ProductsParams): Observable<ProductsResponse> {
    const cacheKey = JSON.stringify({
      page: params._page || 1,
      per_page: params._per_page || 20,
      q: params.q || '',
      category_id: params.category_id || '',
      category_ids: params.category_ids || [],
      brand_id: params.brand_id || '',
      branch_id: params.branch_id || '',
      sort: params._sort || '',
      order: params._order || '',
      include_inactive: !!params.include_inactive,
      stock_status: params.stock_status || ''
    });

    const cached = this.listCache()[cacheKey];
    const now = Date.now();

    if (cached && (now - cached.timestamp < this.LIST_TTL)) {
      console.log(`[ProductsStore] 🎯 Cache HIT (List) para clave: "${cacheKey}". Evitando petición a Supabase.`);
      return of({
        pages: cached.totalPages || 1,
        items: cached.totalItems || cached.data.length,
        data: cached.data
      } as unknown as ProductsResponse);
    }

    console.log(`[ProductsStore] 🌐 Cache MISS (List) para clave: "${cacheKey}". Consultando Supabase...`);
    this.loading.set(true);
    this.error.set(null);

    return this.repository.findWithFilters(params).pipe(
      tap((response) => {
        this.listCache.update((currentCache) => ({
          ...currentCache,
          [cacheKey]: {
            data: response.data as Product[],
            timestamp: Date.now(),
            totalItems: response.items,
            totalPages: response.pages
          }
        }));
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err.message || 'Error al obtener listado de productos.');
        return throwError(() => err);
      })
    );
  }

  /**
   * Obtiene el detalle de un producto con caché.
   */
  getProductDetail(id: string): Observable<Product | null> {
    const cached = this.detailCache()[id];
    const now = Date.now();

    if (cached && (now - cached.timestamp < this.DETAIL_TTL)) {
      console.log(`[ProductsStore] 🎯 Cache HIT (Detail) para ID: "${id}". Evitando petición a Supabase.`);
      return of(cached.data);
    }

    console.log(`[ProductsStore] 🌐 Cache MISS (Detail) para ID: "${id}". Consultando Supabase...`);
    this.loading.set(true);
    this.error.set(null);

    return this.repository.getById(id).pipe(
      tap((product) => {
        if (product) {
          this.detailCache.update((currentCache) => ({
            ...currentCache,
            [id]: {
              data: product,
              timestamp: Date.now()
            }
          }));
        }
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err.message || 'Error al obtener detalle de producto.');
        return throwError(() => err);
      })
    );
  }

  /**
   * Limpia la caché (por ejemplo, después de una inserción, modificación o eliminación).
   */
  clearCache(): void {
    console.log('[ProductsStore] 🧹 Limpiando caché de productos.');
    this.listCache.set({});
    this.detailCache.set({});
  }

  /**
   * Invalida un detalle específico de la caché.
   */
  invalidateDetail(id: string): void {
    this.detailCache.update((currentCache) => {
      const copy = { ...currentCache };
      delete copy[id];
      return copy;
    });
  }
}
