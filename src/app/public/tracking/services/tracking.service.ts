import { Injectable, inject } from '@angular/core';
import { AuthService } from '@app/core/services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class TrackingService {
    private auth = inject(AuthService);

    async getRepairByCode(code: string) {
        const supabase = this.auth.getSupabaseClient();
        // Use the RPC function we defined in the migration for secure access
        return await supabase.rpc('get_repair_by_tracking', { code });
    }
}
