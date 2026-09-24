import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { RepairRepository } from '../../domain/repositories/repair.repository';
import { Repair, CreateRepairDto, UpdateRepairDto } from '../../domain/entities/repair.entity';

@Injectable({
    providedIn: 'root'
})
export class FlaskRepairRepository implements RepairRepository {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:5000/api/servicios';

    getById(id: string): Observable<Repair | null> {
        return this.http.get<{ data: Repair[]; total: number }>(this.apiUrl).pipe(
            map(res => res.data.find(r => r.id === id) || null)
        );
    }

    getAll(limit?: number, offset?: number): Observable<Repair[]> {
        return this.http.get<{ data: Repair[]; total: number }>(this.apiUrl).pipe(
            map(res => res.data)
        );
    }

    create(repair: CreateRepairDto): Observable<Repair> {
        return this.http.post<Repair>(this.apiUrl, repair);
    }

    update(id: string, repair: UpdateRepairDto): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, repair);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getByTrackingCode(code: string): Observable<Repair | null> {
        return of(null); // tracking offline not supported
    }

    async uploadImage(file: File): Promise<string> {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            return data.url || '';
        } catch (e) {
            console.error('Error uploading image', e);
            return '';
        }
    }

    getAdminList(params: { branch_id?: string, includeOrphans?: boolean, limit?: number, offset?: number, searchTerm?: string }): Observable<Repair[]> {
        return this.getAll(); // simplificado para offline
    }

    getWorkshopSummary(branch_id?: string, includeOrphans?: boolean, month?: number, year?: number): Observable<any> {
        return of({
            total_ingresados: 0,
            total_reparados: 0,
            total_entregados: 0,
            ingresos_estimados: 0
        }); // default values para offline
    }
}
