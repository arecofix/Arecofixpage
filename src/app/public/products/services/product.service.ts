import { Injectable, inject } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SupabaseClient } from '@supabase/supabase-js';
import { AuthService } from '@app/services/auth.service';
import { LoggerService } from '@app/core/services/logger.service';
import {
  iProductsParams,
  iProductsResponse,
  iProduct,
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

  public getData(params: iProductsParams = {}): Observable<iProductsResponse> {
    const {
      _page = 1,
      _per_page = 10,
      category_id,
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
    if (category_id) query = query.eq('category_id', category_id);
    if (description) query = query.ilike('description', `%${description}%`);
    if (featured !== null && featured !== undefined) query = query.eq('is_featured', featured);
    if (id) query = query.eq('id', id);
    if (name) query = query.ilike('name', `%${name}%`);
    if (price) query = query.eq('price', price);
    if (slug) query = query.eq('slug', slug);

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
          // Normaliza el nombre del campo para coincidir con la interfaz iProduct
          featured: p?.featured ?? p?.is_featured ?? false,
        }));

        return {
          first: 1,
          prev: _page > 1 ? _page - 1 : null,
          next: _page < pages ? _page + 1 : null,
          last: pages,
          pages,
          items: totalItems,
          data: (products as iProduct[]) || [],
        };
      }),
      catchError((err) => {
        this.logger.error('Supabase product query error', err);
        return of({
          first: 1,
          prev: null,
          next: null,
          last: 1,
          pages: 1,
          items: 0,
          data: [],
        });
      })
    );
  }
}
