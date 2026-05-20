import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { RepairsRepository, RepairListDto, RepairDetailDto } from '../../infrastructure/repositories/repairs.repository';

// Interfaz para la estructura de la caché en memoria
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  totalCount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class RepairsStore {
  private repository = inject(RepairsRepository);

  // Cache para consultas de listas (clave: "page_pageSize_branchId_searchTerm")
  private listCache = signal<Record<string, CacheEntry<RepairListDto[]>>>({});

  // Cache para detalles individuales (clave: "repairId")
  private detailCache = signal<Record<string, CacheEntry<RepairDetailDto>>>({});

  // Signals públicas de estado de carga y error
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  // TTL (Time To Live) de la caché: 5 minutos para listas, 2 minutos para detalles
  private readonly LIST_TTL = 5 * 60 * 1000;
  private readonly DETAIL_TTL = 2 * 60 * 1000;

  /**
   * Obtiene una página del listado optimizado de reparaciones.
   * Valida si existe en la caché (Signal) antes de consultar a Supabase.
   */
  getRepairsPage(
    page: number,
    pageSize: number,
    filters?: { branch_id?: string; searchTerm?: string }
  ): Observable<{ data: RepairListDto[]; totalCount: number }> {
    const branchId = filters?.branch_id || '';
    const searchTerm = filters?.searchTerm || '';
    const cacheKey = `${page}_${pageSize}_${branchId}_${searchTerm}`;
    
    const cached = this.listCache()[cacheKey];
    const now = Date.now();

    if (cached && (now - cached.timestamp < this.LIST_TTL)) {
      console.log(`[RepairsStore] 🎯 Cache HIT (List) para clave: "${cacheKey}". Evitando petición a Supabase.`);
      return of({
        data: cached.data,
        totalCount: cached.totalCount || cached.data.length
      });
    }

    console.log(`[RepairsStore] 🌐 Cache MISS (List) para clave: "${cacheKey}". Consultando Supabase...`);
    this.loading.set(true);
    this.error.set(null);

    return this.repository.getOptimizedList(page, pageSize, filters).pipe(
      tap((result) => {
        // Guardar resultado en caché mediante Signal
        this.listCache.update((currentCache) => ({
          ...currentCache,
          [cacheKey]: {
            data: result.data,
            timestamp: Date.now(),
            totalCount: result.totalCount
          }
        }));
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err.message || 'Error al obtener listado de reparaciones.');
        return throwError(() => err);
      })
    );
  }

  /**
   * Obtiene el detalle de una reparación por su ID.
   * Valida la caché (Signal) y realiza mapeos funcionales y transformaciones
   * recursivas para normalizar las respuestas relacionales anidadas.
   */
  getRepairDetail(id: string): Observable<RepairDetailDto | null> {
    const cached = this.detailCache()[id];
    const now = Date.now();

    if (cached && (now - cached.timestamp < this.DETAIL_TTL)) {
      console.log(`[RepairsStore] 🎯 Cache HIT (Detail) para ID: "${id}". Evitando petición a Supabase.`);
      return of(cached.data);
    }

    console.log(`[RepairsStore] 🌐 Cache MISS (Detail) para ID: "${id}". Consultando Supabase...`);
    this.loading.set(true);
    this.error.set(null);

    return this.repository.getOptimizedDetail(id).pipe(
      // Aplicación de operadores funcionales de RxJS para normalizar y limpiar la data
      map((detail) => {
        if (!detail) return null;
        return this.normalizeDetailData(detail);
      }),
      tap((normalizedDetail) => {
        if (normalizedDetail) {
          this.detailCache.update((currentCache) => ({
            ...currentCache,
            [id]: {
              data: normalizedDetail,
              timestamp: Date.now()
            }
          }));
        }
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err.message || 'Error al obtener detalle de la reparación.');
        return throwError(() => err);
      })
    );
  }

  /**
   * Limpia toda la caché local. Debe ser llamado cuando hay mutaciones
   * (crear, actualizar o eliminar registros).
   */
  clearCache(): void {
    console.log('[RepairsStore] 🧹 Limpiando caché de reparaciones.');
    this.listCache.set({});
    this.detailCache.set({});
  }

  /**
   * Invalida de forma selectiva un registro individual de detalle de la caché.
   */
  invalidateDetail(id: string): void {
    this.detailCache.update((currentCache) => {
      const copy = { ...currentCache };
      delete copy[id];
      return copy;
    });
  }

  /**
   * Procesa recursivamente un objeto y transforma estructuras relacionales complejas
   * en formatos amigables para el frontend (Ej: aplanar arrays de imágenes relacionales).
   */
  private normalizeDetailData(detail: RepairDetailDto): RepairDetailDto {
    // 1. Clonar el objeto original de forma profunda
    const normalized = JSON.parse(JSON.stringify(detail));

    // 2. Método recursivo de limpieza de valores nulos o formateo de fechas
    const formatValuesRecursively = (obj: any): any => {
      if (obj === null || obj === undefined) return obj;
      
      if (Array.isArray(obj)) {
        return obj.map(item => formatValuesRecursively(item));
      }

      if (typeof obj === 'object') {
        const result: any = {};
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            // Convertir fechas ISO en Date u omitir valores null repetitivos
            if (typeof obj[key] === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj[key])) {
              result[key] = new Date(obj[key]).toLocaleString();
            } else {
              result[key] = formatValuesRecursively(obj[key]);
            }
          }
        }
        return result;
      }
      return obj;
    };

    const formatted = formatValuesRecursively(normalized);

    // 3. Método funcional: Aplanar array de imágenes de Supabase
    // Entrada: [{ image_url: "url1" }, { image_url: "url2" }]
    // Salida: ["url1", "url2"] en un array plano
    if (detail.images && Array.isArray(detail.images)) {
      formatted.imagesFlattened = detail.images
        .map((img: any) => img.image_url)
        .filter((url): url is string => typeof url === 'string' && url.length > 0);
    } else {
      formatted.imagesFlattened = [];
    }

    return formatted;
  }
}
