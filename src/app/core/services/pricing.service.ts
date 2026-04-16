import { Injectable, inject, computed } from '@angular/core';
import { TenantService } from './tenant.service';

@Injectable({
    providedIn: 'root'
})
export class PricingService {
    private tenantService = inject(TenantService);

    /** Current USD rate for the tenant */
    usdRate = computed(() => this.tenantService.currentTenant()?.usd_rate || 1);

    /** Current Tax percentage for the tenant (e.g. 21) */
    taxPercent = computed(() => this.tenantService.currentTenant()?.tax_percentage ?? 21);

    /**
     * Converts an amount from USD to the local currency based on the current rate.
     */
    convertToLocal(amountInUsd: number): number {
        return amountInUsd * this.usdRate();
    }

    /**
     * Calculates the final price including tax.
     * @param subtotal The net amount before tax
     * @returns The total amount including tax
     */
    calculateFinalPrice(subtotal: number): number {
        const TAX_MULTIPLIER = 1 + (this.taxPercent() / 100);
        return Math.round(subtotal * TAX_MULTIPLIER);
    }

    /**
     * Calculates the tax amount for a given subtotal.
     */
    calculateTaxAmount(subtotal: number): number {
        return subtotal * (this.taxPercent() / 100);
    }
}
