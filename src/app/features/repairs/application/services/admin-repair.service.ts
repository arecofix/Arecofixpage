import { Injectable, inject } from '@angular/core';
import { RepairRepository } from '../../domain/repositories/repair.repository';
import { Repair, CreateRepairDto, UpdateRepairDto, RepairStatus } from '../../domain/entities/repair.entity';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminRepairService {
    private repository = inject(RepairRepository);

    async getById(id: string): Promise<Repair> {
        return firstValueFrom(this.repository.getById(id));
    }

    async create(dto: CreateRepairDto & { status: RepairStatus, final_cost: number, tracking_code?: string }): Promise<Repair> {
        const payload = { ...dto };
        
        // Logic: Auto-generate tracking code if missing
        if (!payload.tracking_code) {
             // We need to extend CreateRepairDto to allow tracking_code or handle it in repo?
             // Actually, tracking_code is readonly in entity but required for creation usually. 
             // Let's assume the DB or logic sets it. Here we explicitly set it.
             // We need to cast or update DTO definition if we want strict typing about tracking_code.
             // For now, let's treat it as part of CreateRepairDto extended.
             (payload as any).tracking_code = this.generateTrackingCode();
        }

        // Logic: Set completed_at if status is final
        if (this.isFinalStatus(payload.status)) {
            (payload as any).completed_at = new Date().toISOString();
        }

        return firstValueFrom(this.repository.create(payload as any));
    }

    async update(id: string, dto: UpdateRepairDto): Promise<void> {
        const payload = { ...dto };

        // Logic: Set completed_at if status changes to final
        if (payload.status && this.isFinalStatus(payload.status)) {
            payload.completed_at = new Date().toISOString();
        }

        await firstValueFrom(this.repository.update(id, payload));
    }

    async uploadImage(file: File): Promise<string> {
        return this.repository.uploadImage(file);
    }

    private generateTrackingCode(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    private isFinalStatus(status: RepairStatus): boolean {
        return status === RepairStatus.COMPLETED || status === RepairStatus.DELIVERED;
    }
}
