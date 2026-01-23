
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../domain/repositories/product.repository';

@Injectable({
  providedIn: 'root'
})
export class GetAvailableProductsUseCase {
  private repository = inject(ProductRepository);

  execute(): Observable<Product[]> {
    return this.repository.findAvailable();
  }
}
