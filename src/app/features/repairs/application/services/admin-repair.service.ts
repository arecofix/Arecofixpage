import { Injectable, inject } from '@angular/core';
import { RepairRepository } from '../../domain/repositories/repair.repository';
import { Repair, CreateRepairDto, UpdateRepairDto, RepairStatus, RepairPart } from '../../domain/entities/repair.entity';
import { Observable, firstValueFrom } from 'rxjs';
import { AuthService } from '@app/core/services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AdminRepairService {
    private repository = inject(RepairRepository);
    private auth = inject(AuthService);

    // Status logic
    private readonly STATUS_DELIVERED = RepairStatus.DELIVERED;
    private readonly STATUS_CANCELLED = RepairStatus.CANCELLED;

    async getById(id: string): Promise<Repair> {
        return firstValueFrom(this.repository.getById(id));
    }

    async getAdminList(limit?: number, offset?: number): Promise<Repair[]> {
        const user = this.auth.getCurrentUser();
        if (!user) throw new Error('Usuario no autenticado');

        const profile = await this.auth.getUserProfile(user.id);
        const branch_id = profile?.branch_id;

        return firstValueFrom(this.repository.getAdminList({ branch_id, limit, offset }));
    }

    async delete(id: string): Promise<void> {
        await firstValueFrom(this.repository.delete(id));
    }

    async create(dto: CreateRepairDto): Promise<Repair> {
        const user = this.auth.getCurrentUser();
        if (!user) throw new Error('Usuario no autenticado');

        const profile = await this.auth.getUserProfile(user.id);
        if (!profile) throw new Error('Perfil no encontrado');

        const payload: any = {
            ...dto,
            branch_id: profile.branch_id,
            received_by: user.id,
            assigned_technician_id: dto.assigned_technician_id || user.id,
            tracking_code: this.generateTrackingCode()
        };

        // Logic: Set completed_at if status is final
        if (payload.current_status_id && this.isFinalStatus(payload.current_status_id)) {
            payload.completed_at = new Date().toISOString();
        }

        return firstValueFrom(this.repository.create(payload));
    }

    async update(id: string, dto: UpdateRepairDto): Promise<void> {
        const payload = { ...dto };

        // Logic: Set completed_at if status changes to final
        if (payload.current_status_id && this.isFinalStatus(payload.current_status_id)) {
            if (!payload.completed_at) {
                payload.completed_at = new Date().toISOString();
            }
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
        return statusId === this.STATUS_DELIVERED || statusId === this.STATUS_CANCELLED;
    }
}
