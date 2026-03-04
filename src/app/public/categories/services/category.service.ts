import { inject, Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { SupabaseClient } from '@supabase/supabase-js';
import { AuthService } from '@app/core/services/auth.service';
import { LoggerService } from '@app/core/services/logger.service';
import { TenantService } from '@app/core/services/tenant.service';
import { StringUtils } from '@app/shared/utils/string.utils';
import {
  iCategoriesResponse,
  iRequestParams,
  iCategory,
} from '@app/public/categories/interfaces';
import { CategoryRepository } from '@app/features/products/domain/repositories/category.repository';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private supabase: SupabaseClient;
  private logger = inject(LoggerService);
  private tenantService = inject(TenantService);
  private categoryRepo = inject(CategoryRepository);

  constructor(private authService: AuthService) {
    this.supabase = this.authService.getSupabaseClient();
  }

  private processResponse(data: any[], count: number | null, params: { _page: number; _per_page: number }): iCategoriesResponse {
    const totalItems = count || data.length;
    const perPage = params._per_page > 0 ? params._per_page : totalItems;
    const pages = Math.max(1, Math.ceil(totalItems / (perPage || 1)));

    return {
      first: 1,
      prev: params._page > 1 ? params._page - 1 : null,
      next: params._page < pages ? params._page + 1 : null,
      last: pages,
      pages,
      items: totalItems,
      data: data as iCategory[],
    };
  }

  public getData(params: iRequestParams): Observable<iCategoriesResponse> {
    const { _page = 1, _per_page = 10 } = params;
    const start = (_page - 1) * _per_page;
    const end = start + _per_page - 1;

    return from(
      this.supabase
        .from('categories')
        .select('*', { count: 'exact' })
        .eq('tenant_id', this.tenantService.getTenantId())
        .eq('is_active', true)
        .range(start, end)
    ).pipe(
      map(({ data, count, error }) => {
        if (error) throw error;
        return this.processResponse(data || [], count, { _page, _per_page });
      }),
      catchError((err) => {
        this.logger.error('Supabase Error:', err);
        return of({ first: 1, prev: null, next: null, last: 1, pages: 1, items: 0, data: [] });
      })
    );
  }

  public getFeaturedData(): Observable<iCategoriesResponse> {
    const _page = 1;
    const _per_page = 100;

    return from(
      this.supabase
        .from('categories')
        .select('*', { count: 'exact' })
        .eq('tenant_id', this.tenantService.getTenantId())
        .eq('is_active', true)
        .order('name')
        .limit(_per_page)
    ).pipe(
      map(({ data, count, error }) => {
        if (error) throw error;
        return this.processResponse(data || [], count, { _page, _per_page });
      }),
      catchError((err) => {
        this.logger.error('Supabase Error:', err);
        return of({ first: 1, prev: null, next: null, last: 1, pages: 1, items: 0, data: [] });
      })
    );
  }

  /**
   * Finds a category by its URL slug.
   * Uses exact match first; falls back to case-insensitive partial match.
   * Does NOT filter by type so that the category is always found regardless
   * of whether type was set properly in the admin panel.
   */
  public getDataBySlug(slug: string): Observable<iCategoriesResponse> {
    const normalizedSlug = (slug || '').trim().toLowerCase();
    const tenantId = this.tenantService.getTenantId();

    // Step 1: exact match (fastest, most reliable)
    return from(
      this.supabase
        .from('categories')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('slug', normalizedSlug)
        .limit(1)
    ).pipe(
      switchMap(({ data, error }) => {
        if (error) {
          this.logger.error('Supabase Error (exact slug):', error);
          return of({ data: [] as iCategory[], error });
        }
        if (data && data.length > 0) {
          return of({ data: data as iCategory[], error: null });
        }
        // Step 2: case-insensitive partial fallback (handles slugs with suffixes)
        return from(
          this.supabase
            .from('categories')
            .select('*')
            .eq('tenant_id', tenantId)
            .ilike('slug', `%${normalizedSlug}%`)
            .order('slug')
            .limit(10)
        ).pipe(
          map(({ data: d2, error: e2 }) => {
            if (e2) return { data: [] as iCategory[], error: e2 };
            const rows = (d2 || []) as iCategory[];
            // Prefer best match: starts with the slug
            const best = rows.find(r => r.slug.toLowerCase() === normalizedSlug)
              ?? rows.find(r => r.slug.toLowerCase().startsWith(normalizedSlug))
              ?? rows[0];
            return { data: best ? [best] : [], error: null };
          })
        );
      }),
      map(({ data, error }) => {
        if (error) throw error;
        return this.processResponse(data || [], data?.length ?? 0, { _page: 1, _per_page: 1 });
      }),
      catchError((err) => {
        this.logger.error('Supabase Error (slug lookup):', err);
        return of({ first: 1, prev: null, next: null, last: 1, pages: 1, items: 0, data: [] });
      })
    );
  }

  public getById(id: string): Observable<iCategory | null> {
    if (!id || id === 'null' || id === '0') return of(null);
    return this.categoryRepo.getById(id) as Observable<iCategory>;
  }

  /** Returns all product-type categories for the current tenant */
  public getAll(): Observable<iCategory[]> {
    return this.categoryRepo.getAll({ column: 'name', ascending: true }) as Observable<iCategory[]>;
  }

  /**
   * Resolves the correct category from a multi-segment slug path.
   * e.g. 'repuestos/modulos' → looks up 'modulos' as the leaf slug.
   * Falls back to the full path as a single slug if no match is found.
   */
  public resolveSlugFromPath(slugPath: string): string {
    const segments = slugPath.split('/');
    // The leaf (last segment) is always the target category slug
    return segments[segments.length - 1];
  }

  /**
   * Builds the full ancestor chain for a category (root → ... → parent → self).
   * Operates on an already-loaded flat list to avoid extra HTTP calls.
   * @param categoryId - The ID of the target category
   * @param allCategories - Full flat list of all categories
   * @returns Ordered array from root ancestor to the category itself
   */
  public buildAncestorChain(categoryId: string, allCategories: iCategory[]): iCategory[] {
    const chain: iCategory[] = [];
    let current = allCategories.find(c => c.id === categoryId);

    // Walk up the tree with a guard against circular refs
    const visited = new Set<string>();
    while (current && !visited.has(current.id)) {
      visited.add(current.id);
      chain.unshift(current); // prepend so order is root → leaf
      if (!current.parent_id) break;
      current = allCategories.find(c => c.id === current!.parent_id);
    }

    return chain;
  }

  public create(category: Partial<iCategory>): Observable<iCategory> {
    const slug = category.slug || StringUtils.slugify(category.name || '');
    const payload = { ...category, slug };
    return this.categoryRepo.create(payload) as Observable<iCategory>;
  }

  public update(id: string, category: Partial<iCategory>): Observable<iCategory> {
    return this.categoryRepo.update(id, category) as Observable<iCategory>;
  }
}
