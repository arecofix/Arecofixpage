import { Injectable, inject } from '@angular/core';
import { SupabaseRepairRepository } from '../../infrastructure/repositories/supabase-repair.repository';
import { StockManagementService } from '@app/features/products/application/services/stock-management.service';
import { TenantService } from '@app/core/services/tenant.service';
import { CreateRepairDto, RepairPart } from '../../domain/entities/repair.entity';

/**
 * CLEAN ARCHITECTURE - APPLICATION SERVICE
 * Este servicio orquesta la creación compleja de reparaciones delegando 
 * responsabilidades a los repositorios correspondientes. 
 * Así evitamos tener lógica de negocio pesada en la capa de Infraestructura.
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
    const parts = dto.parts || [];
    
    // 1. Cálculos centralizados en el Application Layer
    const costoRepuestoCalculado = parts.reduce(
        (acc: number, p: RepairPart) => acc + (Number(p.cost_at_time) || 0), 0
    );

    const mappedDto = {
        ...dto,
        costo_repuesto: costoRepuestoCalculado,
        branch_id: currentBranchId,
        deposit_amount: depositAmount
    };

    // 2. Persistencia Principal (Vía Repositorio)
    // El repositorio ya no se encarga del cálculo de piezas ni ingresos, solo de Base de Datos.
    const savedRepair = await this.repairRepo.create(mappedDto).toPromise();

    if (!savedRepair) {
        throw new Error('Fallo al guardar la reparación.');
    }

    // 3. Orquestación Secundaria (Stock)
    // Descontar inventario de todo lo que se usó.
    await this.deductPartsFromStock(parts, currentBranchId);

    // 4. Orquestación Secundaria (Finanzas / Dos Cajas)
    if (depositAmount > 0) {
        await this.registerDepositMovement(savedRepair.id, currentBranchId, depositAmount, savedRepair.tracking_code);
    }

    return savedRepair;
  }

  private async deductPartsFromStock(parts: RepairPart[], branchId: string): Promise<void> {
    for (const part of parts) {
      if (part.product_id) {
         await this.stockService.deductStock(part.product_id, branchId, Number(part.quantity) || 1);
      }
    }
  }

  private async registerDepositMovement(repairId: string, branchId: string, amount: number, trackingCode?: string): Promise<void> {
     // A modo de integración fluida, instanciamos directamente al cliente DB 
     // O usamos el método pertinente en un Repository Financiero (Si lo tuviésemos).
     const supabase = (this.repairRepo as any).supabase; 
     await supabase.from('cash_movements').insert({
         tenant_id: this.tenantService.getTenantId(),
         branch_id: branchId,
         amount: amount,
         type: 'income',
         category: 'repair',
         payment_method: 'efectivo',
         reference_id: repairId,
         notes: `Seña inicial en Ficha #${trackingCode || '(Sin tracking)'}`,
     });
  }
}
