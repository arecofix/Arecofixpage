import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { BranchService } from '@app/core/services/branch.service';
import { ROLES } from '@app/core/constants/roles.constants';
import { TENANT_CONSTANTS } from '@app/core/constants/tenant.constants';

/**
 * Guard para proteger rutas administrativas de sucursales (ej: /larrea/admin)
 * - Super Admin (por email o rol) tiene acceso global a cualquier sucursal
 * - Admin/Tenant Owner tienen acceso global a cualquier sucursal
 * - Staff solo pasa si su profile.branch_id (o slug asociado) coincide con la ruta.
 */
export const branchAdminGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const branchService = inject(BranchService);
  const router = inject(Router);

  console.log('🔍 branchAdminGuard - Checking access for:', state.url);
  
  try {
    const session = await authService.getSession();
    if (!session) {
      console.warn('🚫 No session found, redirecting to login');
      router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    const userId = session.user.id;
    const userProfile = await authService.getUserProfile(userId);
    
    if (!userProfile) {
      console.warn('🚫 No user profile found, redirecting to home');
      router.navigate(['/']);
      return false;
    }

    const role = userProfile.role || ROLES.USER;
    const userEmail = userProfile.email;
    const branchSlug = route.paramMap.get('branchSlug');

    // 1. Validar Acceso
    let hasAccess = false;

    if (authService.isSuperAdmin() || 
        (userEmail && TENANT_CONSTANTS.SUPER_ADMIN_EMAILS.includes(userEmail)) || 
        role === ROLES.SUPER_ADMIN || 
        role === ROLES.ADMIN || 
        role === ROLES.TENANT_OWNER) {
      hasAccess = true;
    } else if (role === (ROLES.STAFF as string) && branchSlug) {
      const userBranchId = userProfile.branch_id;
      if (userBranchId) {
        const branch = await branchService.getBranchBySlug(branchSlug);
        if (branch && branch.id === userBranchId) {
          hasAccess = true;
        }
      }
    }

    if (!hasAccess) {
      console.warn('🚫 Access denied for user:', userEmail, 'role:', role);
      router.navigate(['/']);
      return false;
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
    router.navigate(['/']);
    return false;
  }
};
