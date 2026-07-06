import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, from, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { InvoiceRepository } from '../../domain/repositories/invoice.repository';
import { Invoice } from '../../domain/entities/invoice.entity';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class InvoicesStore {
  private repository = inject(InvoiceRepository);

  // Cache para consultas de listas (clave: "limit_offset_tenantId_searchTerm")
  private listCache = signal<Record<string, CacheEntry<Invoice[]>>>({});

  // Cache para detalles individuales (clave: invoiceId)
  private detailCache = signal<Record<string, CacheEntry<Invoice>>>({});

  // Signals de estado
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  // TTL: 5 minutos para lista, 2 minutos para detalle
  private readonly LIST_TTL = 5 * 60 * 1000;
  private readonly DETAIL_TTL = 2 * 60 * 1000;

  /**
   * Obtiene facturas paginadas con caché de Signals.
   */
  getInvoicesList(params: {
    limit: number;
    offset: number;
    tenantId: string;
    searchTerm?: string;
  }): Observable<Invoice[]> {
    const cacheKey = `${params.limit}_${params.offset}_${params.tenantId}_${params.searchTerm || ''}`;
    const cached = this.listCache()[cacheKey];
    const now = Date.now();

    if (cached && (now - cached.timestamp < this.LIST_TTL)) {
      // console.log(`[InvoicesStore] 🎯 Cache HIT (List) para clave: "${cacheKey}". Evitando petición a Supabase.`);
      return of(cached.data);
    }

    // console.log(`[InvoicesStore] 🌐 Cache MISS (List) para clave: "${cacheKey}". Consultando Supabase...`);
    this.loading.set(true);
    this.error.set(null);

    return from(this.repository.getAll(params)).pipe(
      tap((invoices) => {
        this.listCache.update((currentCache) => ({
          ...currentCache,
          [cacheKey]: {
            data: invoices,
            timestamp: Date.now()
          }
        }));
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err.message || 'Error al obtener facturas.');
        return throwError(() => err);
      })
    );
  }

  /**
   * Obtiene el detalle de una factura con caché.
   */
  getInvoiceDetail(id: string, tenantId: string): Observable<Invoice | null> {
    const cached = this.detailCache()[id];
    const now = Date.now();

    if (cached && (now - cached.timestamp < this.DETAIL_TTL)) {
      // console.log(`[InvoicesStore] 🎯 Cache HIT (Detail) para ID: "${id}". Evitando petición a Supabase.`);
      return of(cached.data);
    }

    // console.log(`[InvoicesStore] 🌐 Cache MISS (Detail) para ID: "${id}". Consultando Supabase...`);
    this.loading.set(true);
    this.error.set(null);

    return from(this.repository.getById(id, tenantId)).pipe(
      tap((invoice) => {
        if (invoice) {
          this.detailCache.update((currentCache) => ({
            ...currentCache,
            [id]: {
              data: invoice,
              timestamp: Date.now()
            }
          }));
        }
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err.message || 'Error al obtener detalle de factura.');
        return throwError(() => err);
      })
    );
  }

  /**
   * Limpia la caché.
   */
  clearCache(): void {
    // console.log('[InvoicesStore] 🧹 Limpiando caché de facturas.');
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
