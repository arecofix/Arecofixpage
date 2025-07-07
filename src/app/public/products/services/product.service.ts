import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
/*  */
import { environment } from '@env/environment';
import {
  iProductsParams,
  iProductsResponse,
} from '@app/public/products/interfaces';

/*  */
const API_URL = `${environment.apiUrl}/products`;
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http: HttpClient = inject(HttpClient);

  public getData(params: iProductsParams = {}) {
    const {
      _page = 1,
      _per_page = 10,
      category_id = null,
      description = '',
      featured = null,
      id = null,
      name = null,
      price = null,
      slug = null,
    } = params;

    const queryParams: Record<string, string | number | boolean> = {};
    if (_page !== undefined) queryParams['_page'] = _page;
    if (_per_page !== undefined) queryParams['_per_page'] = _per_page;
    if (category_id !== null && category_id !== undefined)
      queryParams['category_id'] = String(category_id);
    if (description) queryParams['description'] = String(description);
    if (featured !== null && featured !== undefined)
      queryParams['featured'] = String(featured);
    if (id !== null && id !== undefined) queryParams['id'] = String(id);
    if (name) queryParams['name'] = String(name);
    if (price !== null && price !== undefined)
      queryParams['price'] = String(price);
    if (slug) queryParams['slug'] = String(slug);

    return this.http.get<iProductsResponse>(API_URL, {
      params: queryParams,
    });
  }
}
