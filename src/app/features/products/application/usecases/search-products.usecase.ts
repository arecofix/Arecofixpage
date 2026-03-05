import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../domain/repositories/product.repository';

@Injectable({
  providedIn: 'root'
})
export class SearchProductsUseCase {
  private repository = inject(ProductRepository);

  execute(query: string, categoryId?: string): Observable<Product[]> {
    if (!query || query.trim().length < 2) {
      return this.repository.findWithFilters({ _per_page: 20 }).pipe(
        // Map to get only the data array if needed, but repository returns Observable<Product[]> in findAvailable for example
        // ProductRepository.search should return Observable<Product[]>
      ) as any;
    }
    return this.repository.search(query.trim(), categoryId);
  }
}
