import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { CategoryService } from '@app/public/categories/services';
import { ProductService } from '@app/public/products/services';
import { Product } from '@app/public/products/interfaces';

@Injectable({
  providedIn: 'root'
})
export class GetProductsByCategorySlugUseCase {
  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);

  execute(slug: string, limit: number = 4): Observable<Product[]> {
    return this.categoryService.getDataBySlug(slug).pipe(
      switchMap(response => {
        const category = response.data?.[0];
        if (!category?.id) {
          return of([]);
        }
        return this.productService.getData({ 
            category_id: category.id,
            _per_page: limit
        }).pipe(
          map(res => res.data || [])
        );
      }),
      catchError(error => {
        console.error(`Error fetching products for category ${slug}`, error);
        return of([]);
      })
    );
  }
}
