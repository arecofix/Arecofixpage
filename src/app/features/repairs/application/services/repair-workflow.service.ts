import { Injectable, inject } from '@angular/core';
import { SupabaseRepairRepository } from '../../infrastructure/repositories/supabase-repair.repository';
import { StockManagementService } from '@app/features/products/application/services/stock-management.service';
import { TenantService } from '@app/core/services/tenant.service';
import { CreateRepairDto, RepairPart, RepairStatus } from '../../domain/entities/repair.entity';
import { firstValueFrom } from 'rxjs';

/**
 * CLEAN ARCHITECTURE - APPLICATION SERVICE
 * Este servicio orquesta la creación compleja de reparaciones delegando 
 * responsabilidades a los repositorios correspondientes. 
 */
@Injectable({
  providedIn: 'root'
})
export class RepairWorkflowService {
  private repairRepo = inject(SupabaseRepairRepository);
  private stockService = inject(StockManagementService);
  private tenantService = inject(TenantService);

  /**
   * Ejecuta el flujo completo de "Guardar Ficha" como un caso de uso (UseCase)
   */
  async processNewRepair(dto: CreateRepairDto, depositAmount: number = 0, currentBranchId: string): Promise<any> {
    if (!currentBranchId) throw new Error('Operación fallida: ID de sucursal perdido en el flujo.');
    
    const parts = dto.parts || [];
    
    // 1. Cálculos centralizados
    const costoRepuestoCalculado = parts.reduce(
        (acc: number, p: RepairPart) => acc + (Number(p.cost_at_time) || 0), 0
    );

    const mappedDto = {
        ...dto,
        costo_repuesto: costoRepuestoCalculado,
        branch_id: currentBranchId,
        deposit_amount: depositAmount
    };

    // 2. Persistencia Principal
    const savedRepair = await firstValueFrom(this.repairRepo.create(mappedDto));

    if (!savedRepair) {
        throw new Error('Fallo al guardar la reparación.');
    }

    // 3. Stock
    await this.deductPartsFromStock(parts, currentBranchId);

    // 4. Finanzas (Seña inicial)
    if (depositAmount > 0) {
        await this.registerDepositMovement(savedRepair.id, currentBranchId, depositAmount, savedRepair.tracking_code);
    }

    return savedRepair;
  }

  /**
   * Actualiza una reparación reconciliando el stock y finanzas.
   */
  async processUpdateRepair(id: string, dto: any): Promise<void> {
    const original = await firstValueFrom(this.repairRepo.getById(id));
    if (!original) throw new Error('Reparación no encontrada');

    const branchId = dto.branch_id || original.branch_id;
    if (!branchId) throw new Error('Sucursal no determinada para actualización.');

    // 1. Persistencia Principal
    await firstValueFrom(this.repairRepo.update(id, dto));

    // 2. Reconciliación de Stock
    if (dto.parts) {
      await this.reconcilePartsStock(original.parts || [], dto.parts, branchId);
    }

    // 3. Reconciliación Financiera (Pago final al entregar)
    // Usamos Number() para asegurar comparación correcta
    const newStatus = Number(dto.current_status_id);
    const oldStatus = Number(original.current_status_id);
    
    if (newStatus === 6 && oldStatus !== 6) { // 6 = DELIVERED
        const finalCost = Number(dto.final_cost || original.final_cost || 0);
        const deposit = Number(original.deposit_amount || 0);
        const balance = finalCost - deposit;

        if (balance > 0) {
            await this.registerPaymentMovement(
                id, 
                branchId, 
                balance, 
                `Saldo final cobrado al entregar equipo #${original.tracking_code || id.substring(0,8)}`
            );
        }
    }
  }

  private async reconcilePartsStock(oldParts: RepairPart[], newParts: RepairPart[], branchId: string): Promise<void> {
    const oldMap = new Map<string, number>();
    oldParts.forEach(p => {
        if (p.product_id) oldMap.set(p.product_id, (oldMap.get(p.product_id) || 0) + (Number(p.quantity) || 1));
    });

    const newMap = new Map<string, number>();
    newParts.forEach(p => {
        if (p.product_id) newMap.set(p.product_id, (newMap.get(p.product_id) || 0) + (Number(p.quantity) || 1));
    });

    for (const [prodId, newQty] of newMap.entries()) {
        const oldQty = oldMap.get(prodId) || 0;
        const diff = newQty - oldQty;
        if (diff !== 0) {
            await this.stockService.deductStock(prodId, branchId, diff);
        }
    }

    for (const [prodId, oldQty] of oldMap.entries()) {
        if (!newMap.has(prodId)) {
            await this.stockService.deductStock(prodId, branchId, -oldQty);
        }
    }
  }

  private async deductPartsFromStock(parts: RepairPart[], branchId: string): Promise<void> {
    for (const part of parts) {
      if (part.product_id) {
         await this.stockService.deductStock(part.product_id, branchId, Number(part.quantity) || 1);
      }
    }
  }

  private async registerPaymentMovement(repairId: string, branchId: string, amount: number, notes: string): Promise<void> {
     const supabase = (this.repairRepo as any).supabase; 
     await supabase.from('cash_movements').insert({
         tenant_id: this.tenantService.getTenantId(),
         branch_id: branchId,
         amount: amount,
         type: 'income',
         category: 'repair',
         payment_method: 'efectivo',
         reference_id: repairId,
         notes: notes,
     });
  }

  private async registerDepositMovement(repairId: string, branchId: string, amount: number, trackingCode?: string): Promise<void> {
      await this.registerPaymentMovement(
          repairId, 
          branchId, 
          amount, 
          `Seña inicial en Ficha #${trackingCode || '(Sin tracking)'}`
      );
  }
}
