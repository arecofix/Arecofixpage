import { Injectable, inject } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SupabaseClient } from '@supabase/supabase-js';
import { AuthService } from '@app/core/services/auth.service';
import { LoggerService } from '@app/core/services/logger.service';
import {
  ProductsParams,
  ProductsResponse,
  Product,
} from '@app/public/products/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private supabase: SupabaseClient;
  private logger = inject(LoggerService);

  constructor(private authService: AuthService) {
    this.supabase = this.authService.getSupabaseClient();
  }

  public getData(params: ProductsParams = {}): Observable<ProductsResponse> {
    const {
      _page = 1,
      _per_page = 10,
      category_id,
      brand_id,
      description,
      featured,
      id,
      name,
      price,
      slug,
    } = params;

    const start = (_page - 1) * _per_page;
    const end = start + _per_page - 1;

    let query = this.supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('is_active', true);

    // Apply filters
    if (params.category_ids && params.category_ids.length > 0) {

      query = query.in('category_id', params.category_ids);
    } else if (category_id !== undefined && category_id !== null) {
      query = query.eq('category_id', category_id);
    }
    if (brand_id) query = query.eq('brand_id', brand_id);
    if (description) query = query.ilike('description', `%${description}%`);
    if (featured !== null && featured !== undefined) query = query.eq('is_featured', featured);
    if (id) query = query.eq('id', id);
    if (name) query = query.ilike('name', `%${name}%`);
    if (price) query = query.eq('price', price);
    if (slug) query = query.eq('slug', slug);

    // Apply sorting
    if (params._sort) {
      query = query.order(params._sort, { ascending: params._order === 'asc' });
    } else {
      // Default sort
      query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    query = query.range(start, end);

    return from(query).pipe(
      map(({ data, count, error }) => {
        if (error) throw error;

        const totalItems = count || 0;
        const pages = Math.max(1, Math.ceil(totalItems / _per_page));

        const productsRaw = (data as any[]) || [];
        const products = productsRaw.map((p: any) => ({
          ...p,
          // Normaliza el nombre del campo para coincidir con la interfaz Product
          featured: p?.featured ?? p?.is_featured ?? false,
        }));

        return {
          first: 1,
          prev: _page > 1 ? _page - 1 : undefined,
          next: _page < pages ? _page + 1 : undefined,
          last: pages,
          pages,
          items: totalItems,
          data: (products as Product[]) || [],
        };
      }),
      catchError((err) => {
        this.logger.error('Supabase product query error', err);
        return of({
          first: 1,
          prev: undefined,
          next: undefined,
          last: 1,
          pages: 1,
          items: 0,
          data: [],
        });
      })
    );
  }
}
