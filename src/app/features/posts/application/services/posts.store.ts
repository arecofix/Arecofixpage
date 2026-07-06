import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, from, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { AuthService } from '@app/core/services/auth.service';
import { TenantService } from '@app/core/services/tenant.service';
import { Post } from '@app/features/posts/domain/entities/post.entity';
import { SupabaseStorageService } from '@app/core/services/supabase-storage.service';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class PostsStore {
  private auth = inject(AuthService);
  private tenantService = inject(TenantService);
  private supabase = this.auth.getSupabaseClient();
  private storageService = inject(SupabaseStorageService);

  // Cache para consultas de listas (clave: "recent_limit" o "admin_page_pageSize_tenantId")
  private listCache = signal<Record<string, CacheEntry<Post[]>>>({});

  // Cache para detalles individuales (clave: slug o id)
  private detailCache = signal<Record<string, CacheEntry<Post>>>({});

  // Signals de estado
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  // TTL: 10 minutos para listas, 5 minutos para detalles
  private readonly LIST_TTL = 10 * 60 * 1000;
  private readonly DETAIL_TTL = 5 * 60 * 1000;

  /**
   * Obtiene posts recientes (públicos) con caché.
   */
  getRecentPosts(limit = 5): Observable<Post[]> {
    const cacheKey = `recent_${limit}`;
    const cached = this.listCache()[cacheKey];
    const now = Date.now();

    if (cached && (now - cached.timestamp < this.LIST_TTL)) {
      // console.log(`[PostsStore] 🎯 Cache HIT (Recent Posts) para clave: "${cacheKey}".`);
      return of(cached.data);
    }

    // console.log(`[PostsStore] 🌐 Cache MISS (Recent Posts) para clave: "${cacheKey}".`);
    this.loading.set(true);
    this.error.set(null);

    const selectFields = 'id, title, slug, featured_image, created_at, updated_at, tenant_id, status';
    const query = this.supabase
      .from('blog_posts')
      .select(selectFields)
      .order('created_at', { ascending: false })
      .limit(limit);

    return from(query).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data || []).map((item: any) => this.mapToEntity(item));
      }),
      tap((posts) => {
        this.listCache.update((currentCache) => ({
          ...currentCache,
          [cacheKey]: {
            data: posts,
            timestamp: Date.now()
          }
        }));
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err.message || 'Error al obtener posts recientes.');
        return throwError(() => err);
      })
    );
  }

  /**
   * Obtiene posts del panel de administración (paginados) con caché.
   */
  getAdminPosts(page?: number, pageSize?: number): Observable<Post[]> {
    const tenantId = this.tenantService.getTenantId();
    const cacheKey = `admin_${page || 'all'}_${pageSize || 'all'}_${tenantId}`;
    const cached = this.listCache()[cacheKey];
    const now = Date.now();

    if (cached && (now - cached.timestamp < this.LIST_TTL)) {
      // console.log(`[PostsStore] 🎯 Cache HIT (Admin Posts) para clave: "${cacheKey}".`);
      return of(cached.data);
    }

    // console.log(`[PostsStore] 🌐 Cache MISS (Admin Posts) para clave: "${cacheKey}".`);
    this.loading.set(true);
    this.error.set(null);

    const selectFields = 'id, title, slug, featured_image, created_at, updated_at, tenant_id, status';
    let query = this.supabase
      .from('blog_posts')
      .select(selectFields)
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });

    if (page !== undefined && pageSize !== undefined) {
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;
      query = query.range(start, end);
    }

    return from(query).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data || []).map((item: any) => this.mapToEntity(item));
      }),
      tap((posts) => {
        this.listCache.update((currentCache) => ({
          ...currentCache,
          [cacheKey]: {
            data: posts,
            timestamp: Date.now()
          }
        }));
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err.message || 'Error al obtener posts de administración.');
        return throwError(() => err);
      })
    );
  }

  /**
   * Obtiene el detalle de un post por slug con caché.
   */
  getPostBySlug(slug: string): Observable<Post | null> {
    const cached = this.detailCache()[slug];
    const now = Date.now();

    if (cached && (now - cached.timestamp < this.DETAIL_TTL)) {
      // console.log(`[PostsStore] 🎯 Cache HIT (Post Detail Slug) para: "${slug}".`);
      return of(cached.data);
    }

    // console.log(`[PostsStore] 🌐 Cache MISS (Post Detail Slug) para: "${slug}".`);
    this.loading.set(true);
    this.error.set(null);

    const query = this.supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    return from(query).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data ? this.mapToEntity(data) : null;
      }),
      tap((post) => {
        if (post) {
          this.detailCache.update((currentCache) => ({
            ...currentCache,
            [slug]: {
              data: post,
              timestamp: Date.now()
            }
          }));
        }
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err.message || 'Error al obtener detalle del post.');
        return throwError(() => err);
      })
    );
  }

  /**
   * Obtiene el detalle de un post por ID con caché.
   */
  getPostById(id: string): Observable<Post | null> {
    const cached = this.detailCache()[id];
    const now = Date.now();

    if (cached && (now - cached.timestamp < this.DETAIL_TTL)) {
      // console.log(`[PostsStore] 🎯 Cache HIT (Post Detail ID) para: "${id}".`);
      return of(cached.data);
    }

    // console.log(`[PostsStore] 🌐 Cache MISS (Post Detail ID) para: "${id}".`);
    this.loading.set(true);
    this.error.set(null);

    const query = this.supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', this.tenantService.getTenantId())
      .maybeSingle();

    return from(query).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data ? this.mapToEntity(data) : null;
      }),
      tap((post) => {
        if (post) {
          this.detailCache.update((currentCache) => ({
            ...currentCache,
            [id]: {
              data: post,
              timestamp: Date.now()
            }
          }));
        }
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err.message || 'Error al obtener detalle del post.');
        return throwError(() => err);
      })
    );
  }

  /**
   * Limpia toda la caché.
   */
  clearCache(): void {
    // console.log('[PostsStore] 🧹 Limpiando caché de blog.');
    this.listCache.set({});
    this.detailCache.set({});
  }

  private mapToEntity(data: any): Post {
    const rawImage = data.featured_image || data.image || data.image_url;
    return {
      ...data,
      image: this.getImageUrl(rawImage)
    } as Post;
  }

  private getImageUrl(pathOrUrl: string | null): string | null {
    if (!pathOrUrl) return null;
    if (pathOrUrl.startsWith('assets/')) return pathOrUrl;
    
    return this.storageService.getPublicUrl(pathOrUrl, 'public-assets');
  }
}
