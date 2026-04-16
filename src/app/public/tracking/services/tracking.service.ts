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

    async getRecommendedAccessories(code: string, brand?: string) {
        const supabase = this.auth.getSupabaseClient();
        
        let { data, error } = await supabase.rpc('get_recommended_accessories', { p_tracking_code: code });

        // If it doesn't return enough products (less than 3), fallback to query manually
        if (!error && data) {
            if ((data as any[]).length < 3 && brand && brand.toLowerCase() !== 'generic') {
                const { data: fallback } = await supabase
                    .from('products')
                    .select('*')
                    .eq('is_active', true)
                    .ilike('name', `%${brand}%`)
                    .limit(4);
                
                if (fallback && fallback.length > 0) {
                    // merge unique
                    const existingIds = new Set((data as any[]).map(d => d.id));
                    fallback.forEach(f => {
                        if (!existingIds.has(f.id) && f.stock > 0) {
                            (data as any[]).push(f);
                        }
                    });
                }
            }
            // Still less than 3? Load random active stock
            if ((data as any[]).length < 3) {
                 const { data: randoms } = await supabase
                    .from('products')
                    .select('*')
                    .eq('is_active', true)
                    .gt('stock', 0)
                    .limit(4);
                 
                 if (randoms) {
                    const existingIds = new Set((data as any[]).map(d => d.id));
                    randoms.forEach(f => {
                        if (!existingIds.has(f.id)) {
                            (data as any[]).push(f);
                        }
                    });
                 }
            }
        }
        
        return { data, error };
    }

    async addAccessoryUpsell(code: string, productId: string) {
        const supabase = this.auth.getSupabaseClient();
        return await supabase.rpc('add_upsell_item_to_repair', { 
            p_tracking_code: code,
            p_product_id: productId
        });
    }
}
