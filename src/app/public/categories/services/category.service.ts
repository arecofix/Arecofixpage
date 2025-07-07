import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
/*  */
import { environment } from '@env/environment';

import {
  iCategoriesResponse,
  iRequestParams,
} from '@app/public/categories/interfaces';

const API_URL = `${environment.apiUrl}/categories`;

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http: HttpClient = inject(HttpClient);

  public getData(params: iRequestParams):Observable<iCategoriesResponse> {
    const { _page = 1, _per_page = 0 } = params;

    return this.http.get<iCategoriesResponse>(API_URL, {
      params: {
        _page,
        _per_page,
      },
    });
  }

  public getFeaturedData() {
    const _page: number = 1;
    const _per_page: number = 3;
    const featured: boolean = true;

    return this.http.get<iCategoriesResponse>(API_URL, {
      params: {
        _page,
        _per_page,
        featured,
      },
    });
  }

  public getDataBySlug(slug: Observable<string> | string) {
    const params = {
      _page: 1,
      _per_page: 1,
      slug: typeof slug === 'string' ? slug : slug.toString(),
    };

    return this.http.get<iCategoriesResponse>(API_URL, {
      params
    });
  }
}
