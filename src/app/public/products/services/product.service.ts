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
  private authService = inject(AuthService);
  private logger = inject(LoggerService);
  private supabase: SupabaseClient = this.authService.getSupabaseClient();

  constructor() {}

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
      min_price,
      max_price,
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
    if (min_price !== undefined) query = query.gte('price', min_price);
    if (max_price !== undefined) query = query.lte('price', max_price);
    
    // Search query
    if (params.q) {
      query = query.or(`name.ilike.%${params.q}%,description.ilike.%${params.q}%`);
    }

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

        const productsRaw = (data as unknown as Record<string, unknown>[]) || [];
        const products: Product[] = productsRaw.map((p) => ({
          id: p['id'] as string,
          name: p['name'] as string,
          slug: p['slug'] as string,
          description: p['description'] as string,
          price: Number(p['price']),
          image_url: p['image_url'] as string,
          category_id: p['category_id'] as string,
          brand_id: p['brand_id'] as string,
          stock: Number(p['stock']),
          is_active: Boolean(p['is_active']),
          // Normaliza el nombre del campo para coincidir con la interfaz Product
          featured: Boolean(p['featured'] ?? p['is_featured'] ?? false),
          created_at: p['created_at'] as string,
          updated_at: p['updated_at'] as string,
        }));

        return {
          first: 1,
          prev: _page > 1 ? _page - 1 : undefined,
          next: _page < pages ? _page + 1 : undefined,
          last: pages,
          pages,
          items: totalItems,
          data: products,
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
