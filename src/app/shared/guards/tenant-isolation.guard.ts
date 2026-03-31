import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TenantService } from '@app/core/services/tenant.service';

@Injectable({
  providedIn: 'root'
})
export class TenantIsolationGuard implements CanActivate {
  private tenantService = inject(TenantService);
  private router = inject(Router);

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const url = state.url || '/';
    
    // Log para depuración profunda (con prefijo único)
    // console.debug(`[TenantGuard v2] Processing route: ${url}`);
    
    // 1. SIEMPRE permitir la raíz para evitar bucles infinitos de redirección
    if (url === '/' || url === '') {
      return true;
    }

    // 2. Obtener tenant actual
    let currentTenant = this.tenantService.getCurrentTenant();
    
    // 3. Analizar segmentos de ruta
    const pathSegments = url.split('/').filter(segment => segment);
    const potentialBranchSlug = pathSegments[0]?.toLowerCase();
    
    const reservedSlugs = [
      'admin', 'login', 'register', 'perfil', 'nosotros', 'contacto', 
      'servicios', 'academy', 'checkout', 'posts', 'tracking', 'blog', 
      'portfolio', 'productos', 'categories', 'repuestos', 'gsm', 'fixtecnicos', 'recursos'
    ];

    // 4. Verificación de Sucursal por Ruta
    if (potentialBranchSlug && !reservedSlugs.includes(potentialBranchSlug)) {
      const targetTenant = await this.tenantService.getTenantBySlug(potentialBranchSlug);
      
      if (targetTenant) {
        if (!this.tenantService.isCurrentTenant(targetTenant.id)) {
          console.log(`[TenantGuard v2] Switching to branch: ${targetTenant.name}`);
          await this.tenantService.setCurrentTenant(targetTenant.id);
          currentTenant = this.tenantService.getCurrentTenant();
        }
      } else {
        // No es una sucursal conocida, asegurar que estamos en el tenant principal si estamos en el dominio base
        if (this.tenantService.isMainDomain() && !this.tenantService.isMainTenant()) {
          console.log('[TenantGuard v2] Unknown slug on main domain, switching to central');
          await this.tenantService.setCurrentTenant('central');
          currentTenant = this.tenantService.getCurrentTenant();
        }
      }
    }
    
    // 5. Validar acceso a la ruta (Diferente a la raíz)
    const isAllowed = this.validateRouteAccess(url, currentTenant);
    
    if (!isAllowed) {
      const tenantName = currentTenant ? (currentTenant.name || 'Unnamed Tenant') : 'No Tenant';
      console.warn(`[TenantGuard v2] Access DENIED to: ${url} for tenant: ${tenantName}`);
      
      // Solo redirigimos si NO estamos ya en la raíz (doble chequeo)
      if (url !== '/' && url !== '') {
        this.router.navigate(['/']);
      }
      return false;
    }
    
    return true;
  }

  /**
   * Valida si el tenant actual tiene acceso a la ruta solicitada
   */
  private validateRouteAccess(url: string, tenant: any): boolean {
    // Si la ruta es la raíz, ya la permitimos arriba, pero por si acaso:
    if (url === '/' || url === '') return true;
    
    // Si es el inquilino principal (Arecofix central), tiene acceso a todas las rutas comunes
    if (tenant?.slug === 'arecofix' || this.tenantService.isMainTenant()) {
      return true;
    }
    
    // Si no hay tenant y no es el principal, denegar acceso a rutas de características
    if (!tenant) return false;
    
    // Rutas protegidas por características de sucursal
    const restrictedRoutes = [
      { path: '/products', feature: 'hasProducts' },
      { path: '/productos', feature: 'hasProducts' },
      { path: '/servicios', feature: 'hasServices' },
      { path: '/academy', feature: 'hasCourses' },
      { path: '/repairs', feature: 'hasRepairs' },
      { path: '/blog', feature: 'hasBlog' }
    ];
    
    for (const route of restrictedRoutes) {
      if (url.includes(route.path)) {
        return tenant.features?.[route.feature] === true;
      }
    }
    
    return true;
  }
}
