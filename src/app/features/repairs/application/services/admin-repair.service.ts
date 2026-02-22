import { Injectable, inject } from '@angular/core';
import { RepairRepository } from '../../domain/repositories/repair.repository';
import { Repair, CreateRepairDto, UpdateRepairDto, RepairStatus } from '../../domain/entities/repair.entity';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminRepairService {
    private repository = inject(RepairRepository);

    // Status IDs Mapping (Standardized)
    private readonly STATUS_COMPLETED = 4;
    private readonly STATUS_DELIVERED = 5;

    async getById(id: string): Promise<Repair> {
        return firstValueFrom(this.repository.getById(id));
    }

    async create(dto: CreateRepairDto & { current_status_id: number, final_cost: number, tracking_code?: string }): Promise<Repair> {
        const payload = { ...dto };
        
        if (!payload.tracking_code) {
             (payload as any).tracking_code = this.generateTrackingCode();
        }

        // Logic: Set completed_at if status is final
        if (this.isFinalStatus(payload.current_status_id)) {
            (payload as any).completed_at = new Date().toISOString();
        }

        return firstValueFrom(this.repository.create(payload as any));
    }

    async update(id: string, dto: UpdateRepairDto): Promise<void> {
        const payload = { ...dto };

        // Logic: Set completed_at if status changes to final
        if (payload.current_status_id && this.isFinalStatus(payload.current_status_id)) {
            payload.completed_at = new Date().toISOString();
        }

        await firstValueFrom(this.repository.update(id, payload));
    }

    async uploadImage(file: File): Promise<string> {
        return this.repository.uploadImage(file);
    }

    private generateTrackingCode(): string {
        return Math.random().toString(36).substring(2, 10).toUpperCase() + '-' + Date.now().toString(36).toUpperCase();
    }

    private isFinalStatus(statusId: number): boolean {
        return statusId === this.STATUS_COMPLETED || statusId === this.STATUS_DELIVERED;
    }
}
