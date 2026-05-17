import { Injectable, inject } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { LoggerService } from '@app/core/services/logger.service';

export interface ShippingQuote {
    provider: string;
    cost: number;
    estimated_days: number;
}

@Injectable({
    providedIn: 'root'
})
export class ShippingService {
    private supabase = inject(SUPABASE_CLIENT);
    private logger = inject(LoggerService);

    /**
     * Calculates shipping cost based on postal code.
     * In the future, this calls an Edge Function connected to Andreani API.
     */
    calculateShipping(postalCode: string, cartTotal: number): Observable<ShippingQuote | null> {
        if (!postalCode || postalCode.length < 4) {
            return of(null);
        }

        // --- ANDREANI INTEGRATION (MOCKED UNTIL EDGE FUNCTION IS READY) ---
        // For local Marcos Paz (1727), shipping is flat rate or free.
        if (postalCode === '1727') {
            return of({
                provider: 'Envío Local (Arecofix)',
                cost: cartTotal > 50000 ? 0 : 2500, // Free shipping over $50k locally
                estimated_days: 1
            });
        }

        // For other areas, we simulate a call to the Supabase Edge Function that proxies Andreani
        /*
        return from(
            this.supabase.functions.invoke('andreani-shipping-proxy', {
                body: { postalCode, cartTotal }
            })
        ).pipe(
            map(res => {
                if (res.error) throw res.error;
                return res.data as ShippingQuote;
            })
        );
        */

        // Simulated Andreani Response based on distance (first digit of CP in Argentina roughly indicates region)
        const regionPrefix = postalCode.charAt(0);
        let baseCost = 6500;
        let days = 3;

        if (regionPrefix === '1') { baseCost = 4500; days = 2; } // AMBA
        else if (regionPrefix === '2' || regionPrefix === '3') { baseCost = 7000; days = 4; } // Litoral / Centro
        else if (regionPrefix === '8' || regionPrefix === '9') { baseCost = 12000; days = 6; } // Patagonia
        
        return of({
            provider: 'Andreani (Estándar)',
            cost: baseCost,
            estimated_days: days
        });
    }
}
