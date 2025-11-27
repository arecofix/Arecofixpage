import { inject, Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SupabaseClient } from '@supabase/supabase-js';
import { AuthService } from '@app/services/auth.service';

import {
  iCategoriesResponse,
  iRequestParams,
  iCategory,
} from '@app/public/categories/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private supabase: SupabaseClient;

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
        .eq('is_active', true)
        .range(start, end)
    ).pipe(
      map(({ data, count, error }) => {
        if (error) throw error;
        return this.processResponse(data || [], count, { _page, _per_page });
      }),
      catchError((err) => {
        console.error('Supabase Error:', err);
        return of({ first: 1, prev: null, next: null, last: 1, pages: 1, items: 0, data: [] });
      })
    );
  }

  public getFeaturedData(): Observable<iCategoriesResponse> {
    // Assuming featured means something specific or just top categories
    // For now, let's just get the first 3
    const _page = 1;
    const _per_page = 3;

    return from(
      this.supabase
        .from('categories')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
        .limit(_per_page)
    ).pipe(
      map(({ data, count, error }) => {
        if (error) throw error;
        return this.processResponse(data || [], count, { _page, _per_page });
      }),
      catchError((err) => {
        console.error('Supabase Error:', err);
        return of({ first: 1, prev: null, next: null, last: 1, pages: 1, items: 0, data: [] });
      })
    );
  }

  public getDataBySlug(slug: string): Observable<iCategoriesResponse> {
    return from(
      this.supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .limit(1)
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        // Data is an array now
        return this.processResponse(data || [], data?.length || 0, { _page: 1, _per_page: 1 });
      }),
      catchError((err) => {
        console.error('Supabase Error:', err);
        return of({ first: 1, prev: null, next: null, last: 1, pages: 1, items: 0, data: [] });
      })
    );
  }
}
