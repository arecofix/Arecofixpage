import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { FinanceRepository } from '../../domain/repositories/finance.repository';
import { CashMovement } from '../../domain/entities/cash-movement.entity';

@Injectable({
    providedIn: 'root'
})
export class FlaskFinanceRepository implements FinanceRepository {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:5000/api/finances';

    async recordMovement(movement: CashMovement): Promise<CashMovement> {
        return firstValueFrom(this.http.post<CashMovement>(this.apiUrl, movement));
    }

    async getBalance(paymentMethod?: string): Promise<number> {
        const movements = await firstValueFrom(this.getMovements(1000));
        let filtered = movements;
        if (paymentMethod) {
            filtered = movements.filter(m => m.payment_method === paymentMethod);
        }
        return filtered.reduce((acc, curr) => {
            if (curr.type === 'income') return acc + curr.amount;
            return acc - curr.amount;
        }, 0);
    }

    getMovements(limit?: number, offset?: number): Observable<CashMovement[]> {
        return this.http.get<{ data: CashMovement[]; total: number }>(this.apiUrl).pipe(
            map(res => {
                let data = res.data;
                if (limit) data = data.slice(offset || 0, (offset || 0) + limit);
                return data;
            })
        );
    }
}
