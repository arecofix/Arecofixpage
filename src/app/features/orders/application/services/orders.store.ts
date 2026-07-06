import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { Order, OrderStatus } from '../../domain/entities/order.entity';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersStore {
  private repository = inject(OrderRepository);

  // Cache para consultas de listas (clave: "page_pageSize")
  private listCache = signal<Record<string, CacheEntry<Order[]>>>({});

  // Cache para detalles individuales (clave: orderId)
  private detailCache = signal<Record<string, CacheEntry<Order>>>({});

  // Signals de estado
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  // TTL: 5 minutos para lista, 2 minutos para detalle
  private readonly LIST_TTL = 5 * 60 * 1000;
  private readonly DETAIL_TTL = 2 * 60 * 1000;

  /**
   * Obtiene la lista de órdenes con caché.
   */
  getOrdersList(params?: { page?: number; pageSize?: number }): Observable<Order[]> {
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 100; // default to a reasonable chunk
    const cacheKey = `${page}_${pageSize}`;

    const cached = this.listCache()[cacheKey];
    const now = Date.now();

    if (cached && (now - cached.timestamp < this.LIST_TTL)) {
      // console.log(`[OrdersStore] 🎯 Cache HIT (List) para clave: "${cacheKey}". Evitando petición a Supabase.`);
      return of(cached.data);
    }

    // console.log(`[OrdersStore] 🌐 Cache MISS (List) para clave: "${cacheKey}". Consultando Supabase...`);
    this.loading.set(true);
    this.error.set(null);

    return this.repository.getOrders(params).pipe(
      tap((orders) => {
        this.listCache.update((currentCache) => ({
          ...currentCache,
          [cacheKey]: {
            data: orders,
            timestamp: Date.now()
          }
        }));
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err.message || 'Error al obtener órdenes.');
        return throwError(() => err);
      })
    );
  }

  /**
   * Obtiene el detalle de una orden por ID.
   */
  getOrderDetail(id: string): Observable<Order | null> {
    const cached = this.detailCache()[id];
    const now = Date.now();

    if (cached && (now - cached.timestamp < this.DETAIL_TTL)) {
      // console.log(`[OrdersStore] 🎯 Cache HIT (Detail) para ID: "${id}". Evitando petición a Supabase.`);
      return of(cached.data);
    }

    // console.log(`[OrdersStore] 🌐 Cache MISS (Detail) para ID: "${id}". Consultando Supabase...`);
    this.loading.set(true);
    this.error.set(null);

    return this.repository.getOrderById(id).pipe(
      tap((order) => {
        if (order) {
          this.detailCache.update((currentCache) => ({
            ...currentCache,
            [id]: {
              data: order,
              timestamp: Date.now()
            }
          }));
        }
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err.message || 'Error al obtener detalle de orden.');
        return throwError(() => err);
      })
    );
  }

  /**
   * Limpia toda la caché local.
   */
  clearCache(): void {
    // console.log('[OrdersStore] 🧹 Limpiando caché de órdenes.');
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
