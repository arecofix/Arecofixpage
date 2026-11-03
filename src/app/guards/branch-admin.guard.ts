import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { BranchService } from '@app/core/services/branch.service';
import { ROLES } from '@app/core/constants/roles.constants';
import { TENANT_CONSTANTS } from '@app/core/constants/tenant.constants';
import { filter, take, timeout, catchError } from 'rxjs/operators';
import { of, firstValueFrom } from 'rxjs';

/**
 * Guard para proteger rutas administrativas de sucursales (ej: /larrea/admin)
 * - Super Admin (por email o rol) tiene acceso global a cualquier sucursal
 * - Admin/Tenant Owner tienen acceso global a cualquier sucursal
 * - Staff solo pasa si su profile.branch_id (o slug asociado) coincide con la ruta.
 */
export const branchAdminGuard: CanActivateFn = async (route, state) => {
  const platformId = inject(PLATFORM_ID);
  if (isPlatformServer(platformId)) {
    return true;
  }

  const authService = inject(AuthService);
  const branchService = inject(BranchService);
  const router = inject(Router);

  
  try {
    const authState = await firstValueFrom(
      authService.authState$.pipe(
        filter(s => s.isInitialized),
        take(1),
        timeout(5000), // Safety timeout
        catchError(() => of({ session: null, user: null, profile: null, isInitialized: true }))
      )
    );

    const session = authState.session;
    if (!session) {
      return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }

    const userProfile = authState.profile;
    
    if (!userProfile) {
      return router.createUrlTree(['/']);
    }

    const role = userProfile.role || ROLES.USER;
    const userEmail = userProfile.email;
    const branchSlug = route.paramMap.get('branchSlug') || route.paramMap.get('branch-slug');

    // 1. Validar Acceso
    let hasAccess = false;

    if (authService.isSuperAdmin() || 
        (userEmail && TENANT_CONSTANTS.SUPER_ADMIN_EMAILS.includes(userEmail)) || 
        role === ROLES.SUPER_ADMIN || 
        role === ROLES.TENANT_OWNER) {
      hasAccess = true;
    } else if ([ROLES.ADMIN as string, ROLES.STAFF as string, ROLES.TECHNICIAN as string].includes(role) && branchSlug) {
      const userBranchId = userProfile.branch_id;
      if (userBranchId) {
        const branch = await branchService.getBranchBySlug(branchSlug);
        if (branch && branch.id === userBranchId) {
          hasAccess = true;
        }
      }
    }

    if (!hasAccess) {
      return router.createUrlTree(['/']);
    }

    // 2. Sincronizar Contexto de Sucursal
    if (branchSlug) {
        const branch = await branchService.getBranchBySlug(branchSlug);
        if (branch) {
            branchService.setCurrentBranch(branch);
        }
    }

    return true;

  } catch (error) {
    console.error('❌ Error in branchAdminGuard:', error);
    return router.createUrlTree(['/']);
  }
};
