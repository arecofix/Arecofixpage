import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CategoryRepository } from '../../domain/repositories/category.repository';
import { Category } from '../../domain/entities/category.entity';

@Injectable({
    providedIn: 'root'
})
export class FlaskCategoryRepository implements CategoryRepository {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:5000/api/categorias';

    getPaginated(page: number, limit: number, options?: { column?: string; ascending?: boolean; select?: string }): Observable<{ data: Category[]; total: number }> {
        return this.http.get<{ data: Category[]; total: number }>(this.apiUrl).pipe(
            map(response => {
                const start = (page - 1) * limit;
                const end = start + limit;
                return {
                    data: response.data.slice(start, end),
                    total: response.total
                };
            })
        );
    }

    getAll(options?: { column?: string; ascending?: boolean; select?: string }): Observable<Category[]> {
        return this.http.get<{ data: Category[]; total: number }>(this.apiUrl).pipe(
            map(response => response.data)
        );
    }

    getById(id: string): Observable<Category | null> {
        return this.http.get<{ data: Category[]; total: number }>(this.apiUrl).pipe(
            map(response => response.data.find(c => c.id === id) || null)
        );
    }

    create(category: Partial<Category>): Observable<Category> {
        return this.http.post<Category>(this.apiUrl, category);
    }

    update(id: string, category: Partial<Category>): Observable<Category> {
        return this.http.put<Category>(`${this.apiUrl}/${id}`, category);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
