import { Injectable, inject } from '@angular/core';
import { CustomerName } from '../../domain/value-objects/customer-name.vo';
import { DeviceModel } from '../../domain/value-objects/device-model.vo';
import { UpdateRepairDto } from '../../domain/entities/repair.entity';
import { AdminRepairService } from '../services/admin-repair.service';

@Injectable({
    providedIn: 'root'
})
export class UpdateRepairUseCase {
    private adminRepairService = inject(AdminRepairService);

    async execute(id: string, dto: UpdateRepairDto): Promise<void> {
        // Validation using Value Objects
        
        // 1. Validate CustomerName if provided
        if (dto.customer_name !== undefined) {
            // VO will throw error if name is empty or "Cliente"
            CustomerName.create(dto.customer_name);
        }

        // 2. Validate DeviceModel if provided
        if (dto.device_model !== undefined) {
            // VO will throw error if model is empty or "Equipo Genérico"
            DeviceModel.create(dto.device_model);
        }

        // Delegate to existing service (which handles DB persistence, workflows, etc.)
        return this.adminRepairService.update(id, dto);
    }
}
