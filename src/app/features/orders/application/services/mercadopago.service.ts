import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoggerService } from '@app/core/services/logger.service';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';

export interface MpPreferenceResponse {
    init_point: string;
    id: string;
}

@Injectable({
    providedIn: 'root'
})
export class MercadoPagoService {
    private supabase = inject(SUPABASE_CLIENT);
    private logger = inject(LoggerService);

    createPreference(orderId: string, items: any[], shippingCost: number, customerName: string): Observable<MpPreferenceResponse> {
        this.logger.info(`Creating MP Preference for Order ${orderId}`);

        return from(this.supabase.functions.invoke('mercadopago-preferences', {
            body: {
                orderId,
                items,
                shippingCost,
                customerName
            }
        })).pipe(
            map(res => {
                // Network/Supabase level error
                if (res.error) {
                    throw new Error(res.error.message || 'Error al conectar con la función de pago');
                }
                
                // Logical error returned by our Edge Function (e.g., MP validation error)
                if (res.data && res.data.success === false) {
                    console.error('MP Validation Error:', res.data.error);
                    throw new Error(JSON.stringify(res.data.error) || 'Error de validación en Mercado Pago');
                }

                return res.data as MpPreferenceResponse;
            })
        );
    }
}
