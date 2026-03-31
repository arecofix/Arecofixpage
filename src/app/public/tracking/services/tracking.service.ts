import { Injectable, inject } from '@angular/core';
import { AuthService } from '@app/core/services/auth.service';
import { Repair } from '@app/features/repairs/domain/entities/repair.entity';

@Injectable({
    providedIn: 'root'
})
export class TrackingService {
    private auth = inject(AuthService);

    async getRepairByCode(code: string) {
        const supabase = this.auth.getSupabaseClient();
        // Use the RPC function we defined in the migration for secure access
        return await supabase.rpc('get_repair_by_tracking', { t_code: code });
    }

    async acceptUpsell(code: string) {
        const supabase = this.auth.getSupabaseClient();
        return await supabase.rpc('accept_upsell_vidrio', { p_tracking_code: code });
    }

    async getRecommendedAccessories(code: string) {
        const supabase = this.auth.getSupabaseClient();
        return await supabase.rpc('get_recommended_accessories', { p_tracking_code: code });
    }

    async addAccessoryUpsell(code: string, productId: string) {
        const supabase = this.auth.getSupabaseClient();
        return await supabase.rpc('add_upsell_item_to_repair', { 
            p_tracking_code: code,
            p_product_id: productId
        });
    }
}
