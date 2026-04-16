import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '@app/core/services/auth.service';
import { TenantService } from '@app/core/services/tenant.service';
import { AnalyticsRepository, DashboardStats, MonthlyRevenue } from '@app/features/analytics/domain/repositories/analytics.repository';
import { BranchService } from '@app/core/services/branch.service';

export interface TenantDashboardStats extends DashboardStats {
  tenantId: string;
  isBranchAdmin: boolean;
  branchId?: string;
  branchName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TenantIsolatedDashboardService {
  
  constructor(
    private analyticsRepo: AnalyticsRepository,
    private authService: AuthService,
    private tenantService: TenantService,
    private branchService: BranchService
  ) {}

  /**
   * Obtiene estadísticas del dashboard con aislamiento de tenant
   * - Super Admin: Ve estadísticas globales o filtradas por sucursal
   * - Branch Admin: Solo ve estadísticas de su sucursal
   */
  getDashboardStats(branchId?: string): Observable<TenantDashboardStats> {
    const currentUser = this.authService.getCurrentUser();
    const currentProfile = this.authService.getCurrentProfile();
    const isSuperAdmin = this.authService.isSuperAdmin();
    const currentTenant = this.tenantService.getCurrentTenant();
    
    if (!currentUser || !currentTenant) {
      return of(this.createEmptyStats('unknown', false));
    }

    // Branch Admin: Solo puede ver su propia sucursal
    if (!isSuperAdmin) {
      return this.getBranchDashboardStats(currentProfile?.branch_id!, currentTenant.id);
    }

    // Super Admin: Puede ver globales o filtradas por sucursal
    if (branchId) {
      return this.getBranchDashboardStats(branchId, currentTenant.id);
    }

    // Super Admin sin filtro: Ve estadísticas globales
    return this.getGlobalDashboardStats(currentTenant.id);
  }

  /**
   * Obtiene estadísticas globales (solo Super Admin)
   */
  private getGlobalDashboardStats(tenantId: string): Observable<TenantDashboardStats> {
    return this.analyticsRepo.getDashboardStats().pipe(
      map(stats => ({
        ...stats,
        tenantId,
        isBranchAdmin: false,
        branchName: 'Global'
      })),
      catchError(error => {
        console.error('Error loading global dashboard stats:', error);
        return of(this.createEmptyStats(tenantId, false));
      })
    );
  }

  /**
   * Obtiene estadísticas de una sucursal específica
   */
  private getBranchDashboardStats(branchId: string, tenantId: string): Observable<TenantDashboardStats> {
    return this.analyticsRepo.getDashboardStats(branchId).pipe(
      map(stats => ({
        ...stats,
        tenantId,
        isBranchAdmin: true,
        branchId,
        branchName: this.getBranchName(branchId)
      })),
      catchError(error => {
        console.error(`Error loading branch ${branchId} dashboard stats:`, error);
        return of(this.createEmptyStats(tenantId, true, branchId));
      })
    );
  }

  /**
   * Crea estadísticas vacías
   */
  private createEmptyStats(
    tenantId: string, 
    isBranchAdmin: boolean, 
    branchId?: string
  ): TenantDashboardStats {
    return {
      users: 0,
      products: 0,
      sales: 0,
      revenue: 0,
      repairs_month: 0,
      repairs_revenue: 0,
      repairs_profit: 0,
      devices_fixed: 0,
      pending_approvals: 0,
      total_gross_revenue: 0,
      total_cost: 0,
      total_net_profit: 0,
      current_month_gross: 0,
      current_month_cost: 0,
      current_month_profit: 0,
      monthly_breakdown: [],
      sales_chart: [],
      products_chart: [],
      category_chart: [],
      profit_chart: [],
      tenantId,
      isBranchAdmin,
      branchId,
      branchName: branchId ? this.getBranchName(branchId) : (isBranchAdmin ? 'Mi Sucursal' : 'Global')
    };
  }

  private getBranchName(branchId: string): string {
    // Si tenemos la sucursal actual cargada y coincide, usamos su nombre oficial
    const current = this.branchService.currentBranch();
    if (current && current.id === branchId) {
      return current.name;
    }
    
    return 'Sucursal ' + branchId.substring(0, 4);
  }

  canViewGlobalStats(): boolean {
    return this.authService.isSuperAdmin();
  }

  canViewOtherBranches(): boolean {
    return this.authService.isSuperAdmin();
  }

  getCurrentUserBranchId(): string | null {
    const currentProfile = this.authService.getCurrentProfile();
    return currentProfile?.branch_id || null;
  }
}
