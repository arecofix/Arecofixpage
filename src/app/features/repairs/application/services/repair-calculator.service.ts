import { Injectable, inject } from '@angular/core';
import { PricingService } from '@app/core/services/pricing.service';
import { RepairPart } from '../../domain/entities/repair.entity';

@Injectable({
  providedIn: 'root'
})
export class RepairCalculatorService {
  private pricingService = inject(PricingService);

  /**
   * Construye un nuevo objeto de tipo RepairPart 
   * calculando sus valores unitarios y manejando conversión de monedas.
   */
  buildNewPart(product: any, repairId: string): RepairPart {
    const isUsd = product.currency === 'USD';
    
    const unitPrice = isUsd 
      ? this.pricingService.convertToLocal(Number(product.price || 0)) 
      : Number(product.price || 0);
      
    const unitCost = isUsd 
      ? this.pricingService.convertToLocal(Number(product.unit_cost_at_time || 0)) 
      : Number(product.unit_cost_at_time || 0);

    return {
      repair_id: repairId,
      product_id: product.id,
      product_name: product.name,
      name: product.name,
      current_stock: product.stock || 0,
      quantity: 1,
      unit_price_at_time: unitPrice,
      unit_cost_at_time: unitCost,
      cost_at_time: unitCost,
    };
  }

  /**
   * Recalcula el costo final del presupuesto basándose en las piezas y mano de obra.
   * Retorna las piezas actualizadas, el costo total calculado y la seña por defecto sugerida.
   */
  calculateFinancials(parts: RepairPart[], laborCost: number) {
    const updatedParts = parts.map(p => ({
        ...p,
        cost_at_time: (Number(p.unit_cost_at_time) || 0) * (Number(p.quantity) || 1)
    }));

    const partsTotal = updatedParts.reduce((acc, p) => acc + (p.unit_price_at_time * p.quantity), 0);
    const subtotal = (Number(laborCost) || 0) + partsTotal;
    
    const calculatedFinalCost = this.pricingService.calculateFinalPrice(subtotal);

    return {
      updatedParts,
      finalCost: calculatedFinalCost,
      suggestedDeposit: Math.round(calculatedFinalCost * 0.5)
    };
  }
}
