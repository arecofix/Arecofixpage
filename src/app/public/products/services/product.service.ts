import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoggerService } from '@app/core/services/logger.service';
import {
  ProductsParams,
  ProductsResponse,
} from '@app/public/products/interfaces';
import { ProductRepository } from '@app/features/products/domain/repositories/product.repository';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private logger = inject(LoggerService);
  private repository = inject(ProductRepository);

  constructor() {}

  public getData(params: ProductsParams = {}): Observable<ProductsResponse> {
    return this.repository.findWithFilters(params).pipe(
      catchError((err) => {
        this.logger.error('ProductService query error', err);
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
  public updateProduct(id: string, data: any): Observable<any> {
    return this.repository.update(id, data).pipe(
      catchError((err) => {
        this.logger.error('ProductService update error', err);
        throw err;
      })
    );
  }
}
