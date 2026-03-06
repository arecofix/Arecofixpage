import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RepairRepository } from '../../domain/repositories/repair.repository';
import { PublicRepairDto } from '../../domain/dtos/public-repair.dto';
import { Repair, RepairStatus } from '../../domain/entities/repair.entity';

@Injectable({
  providedIn: 'root'
})
export class GetRepairTrackingUseCase {
  private repository = inject(RepairRepository);

  execute(code: string): Observable<PublicRepairDto> {
    return this.repository.getByTrackingCode(code).pipe(
      map(repair => this.mapToPublicDto(repair))
    );
  }

  /**
   * Domain Logic moved here (or to a Domain Service if more complex)
   * Calculation: Saldo a Abonar = Costo Total - Seña
   */
  private mapToPublicDto(repair: Repair): PublicRepairDto {
    const totalCost = Number(repair.final_cost) || Number(repair.estimated_cost) || 0;
    const deposit = Number(repair.deposit_amount) || 0;
    
    // Core Domain Calculation
    const balance = Math.max(0, totalCost - deposit);

    return {
      tracking_code: repair.tracking_code,
      device_model: repair.device_model,
      current_status_id: repair.current_status_id,
      status_label: this.calculateStatusLabel(repair.current_status_id),
      status_color: this.calculateStatusColor(repair.current_status_id),
      received_at: repair.received_at || repair.created_at,
      issue_description: repair.issue_description,
      total_cost: totalCost,
      deposit_amount: deposit,
      balance_to_pay: balance,
      repair_number: repair.repair_number,
      customer_name: repair.customer_name,
      technician_report: repair.technical_report || repair.technician_notes,
      images: repair.images
    };
  }

  private calculateStatusLabel(statusId: number): string {
    const statusMap: Record<number, string> = {
        [RepairStatus.PENDING_DIAGNOSIS]: 'PENDIENTE DE DIAGNÓSTICO',
        [RepairStatus.SUPPLY_MANAGEMENT]: 'GESTIÓN DE REPUESTOS',
        [RepairStatus.IN_PROGRESS]: 'EN REPARACIÓN',
        [RepairStatus.QUALITY_CONTROL]: 'CONTROL DE CALIDAD',
        [RepairStatus.READY_FOR_PICKUP]: 'LISTO PARA RETIRAR',
        [RepairStatus.DELIVERED]: 'ENTREGADO',
        [RepairStatus.CANCELLED]: 'CANCELADO'
    };
    return statusMap[statusId] || 'PENDIENTE';
  }

  private calculateStatusColor(statusId: number): string {
    const colorMap: Record<number, string> = {
        [RepairStatus.PENDING_DIAGNOSIS]: 'bg-amber-100 text-amber-800 border-amber-200',
        [RepairStatus.SUPPLY_MANAGEMENT]: 'bg-cyan-100 text-cyan-800 border-cyan-200',
        [RepairStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800 border-blue-200',
        [RepairStatus.QUALITY_CONTROL]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        [RepairStatus.READY_FOR_PICKUP]: 'bg-green-100 text-green-800 border-green-200',
        [RepairStatus.DELIVERED]: 'bg-slate-100 text-slate-800 border-slate-200',
        [RepairStatus.CANCELLED]: 'bg-rose-100 text-rose-800 border-rose-200'
    };
    return colorMap[statusId] || 'bg-slate-100 text-slate-700';
  }
}
