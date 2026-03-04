import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TenantService } from '../services/tenant.service';

@Injectable({
  providedIn: 'root'
})
export class TenantIsolationGuard implements CanActivate {
  
  constructor(
    private tenantService: TenantService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const currentTenant = this.tenantService.getCurrentTenant();
    const pathSegments = state.url.split('/').filter(segment => segment);
    
    // Detectar si la ruta pertenece a una sucursal específica
    const potentialBranchSlug = pathSegments[0];
    const branches = this.tenantService.getBranches();
    const targetBranch = branches.find(branch => branch.slug === potentialBranchSlug);
    
    if (targetBranch) {
      // Si estamos navegando a una sucursal, asegurar que el tenant correcto esté activo
      if (!this.tenantService.isCurrentTenant(targetBranch.id)) {
        // Temporarily use console until structured logging is properly configured
        console.log(`Switching to branch tenant: ${targetBranch.name}`);
        this.tenantService.setCurrentTenant(targetBranch.id);
        return true;
      }
    } else {
      // Si no es una ruta de sucursal, asegurar que estamos en el tenant principal
      if (!this.tenantService.isMainTenant()) {
        console.log('Switching to main tenant');
        this.tenantService.setCurrentTenant('central');
      }
    }
    
    // Validar que el tenant actual tenga acceso a la ruta solicitada
    if (!this.validateRouteAccess(state.url, currentTenant)) {
      console.warn(`Access denied to route: ${state.url} for tenant: ${currentTenant?.name}`);
      this.router.navigate(['/']);
      return false;
    }
    
    return true;
  }

  /**
   * Valida si el tenant actual tiene acceso a la ruta solicitada
   */
  private validateRouteAccess(url: string, tenant: any): boolean {
    if (!tenant) return false;
    
    // Rutas que requieren características específicas
    const restrictedRoutes = [
      { path: '/products', feature: 'hasProducts' },
      { path: '/servicios', feature: 'hasServices' },
      { path: '/courses', feature: 'hasCourses' },
      { path: '/repairs', feature: 'hasRepairs' },
      { path: '/blog', feature: 'hasBlog' }
    ];
    
    for (const route of restrictedRoutes) {
      if (url.includes(route.path)) {
        return tenant.features[route.feature] === true;
      }
    }
    
    return true;
  }
}
