import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BrandRepository } from '../../domain/repositories/brand.repository';
import { Brand } from '../../domain/entities/brand.entity';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root'
})
export class FlaskBrandRepository implements BrandRepository {
    private http = inject(HttpClient);
    // Asumimos que Flask corre en el puerto 5000 localmente cuando usamos Tauri
    private apiUrl = 'http://localhost:5000/api/marcas';

    getPaginated(page: number, limit: number, options?: { column?: string; ascending?: boolean; select?: string }): Observable<{ data: Brand[]; total: number }> {
        return this.http.get<{ data: Brand[]; total: number }>(this.apiUrl).pipe(
            map(response => {
                // Implementación básica, el paginado real debería ocurrir en Flask
                const start = (page - 1) * limit;
                const end = start + limit;
                return {
                    data: response.data.slice(start, end),
                    total: response.total
                };
            })
        );
    }

    getAll(orderBy?: { column: string; ascending?: boolean }): Observable<Brand[]> {
        return this.http.get<{ data: Brand[]; total: number }>(this.apiUrl).pipe(
            map(response => response.data)
        );
    }

    getById(id: string): Observable<Brand | null> {
        // En una implementación real de Flask añadiríamos un endpoint GET /marcas/:id
        // Por ahora, obtenemos todos y filtramos
        return this.http.get<{ data: Brand[]; total: number }>(this.apiUrl).pipe(
            map(response => response.data.find(b => b.id === id) || null)
        );
    }

    create(brand: Partial<Brand>): Observable<Brand> {
        return this.http.post<Brand>(this.apiUrl, brand);
    }

    update(id: string, brand: Partial<Brand>): Observable<Brand> {
        return this.http.put<Brand>(`${this.apiUrl}/${id}`, brand);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
