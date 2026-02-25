import { Injectable, inject } from '@angular/core';
import { AnalyticsRepository, DashboardStats } from '../../domain/repositories/analytics.repository';
import { Observable, from, map } from 'rxjs';
import { AuthService } from '@app/core/services/auth.service';

import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';

@Injectable({
  providedIn: 'root'
})
export class SupabaseAnalyticsRepository implements AnalyticsRepository {
  private supabase = inject(SUPABASE_CLIENT);

  getDashboardStats(): Observable<DashboardStats> {
    return from(this.supabase.rpc('get_dashboard_stats')).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        
        return {
          users: data?.users || 0,
          products: data?.products || 0,
          sales: data?.sales || 0,
          revenue: data?.revenue || 0,
          repairs_month: data?.repairs_month || 0,
          repairs_revenue: data?.repairs_revenue || 0,
          devices_fixed: data?.devices_fixed || 0,
          sales_chart: data?.sales_chart || [],
          products_chart: data?.products_chart || [],
          category_chart: data?.category_chart || []
        } as DashboardStats;
      })
    );
  }
}
