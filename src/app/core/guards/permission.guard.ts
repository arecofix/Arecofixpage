import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionService } from '../services/permission.service';
import { AuthService } from '../services/auth.service';
import { ROLES } from '../constants/roles.constants';

export const permissionGuard = (permissions: string | string[]): CanActivateFn => {
  return async (route, state) => {
    const platformId = inject(PLATFORM_ID);
    if (isPlatformServer(platformId)) {
      return true;
    }

    const permissionService = inject(PermissionService);
    const authService = inject(AuthService);
    const router = inject(Router);

    const profile = authService.getCurrentProfile();
    const role = profile?.role;

    // Super Admin, Tenant Owner, and Branch Admin always have administrative access
    if (
      authService.isSuperAdmin() ||
      role === ROLES.SUPER_ADMIN ||
      role === ROLES.TENANT_OWNER ||
      role === ROLES.ADMIN
    ) {
      return true;
    }

    if (!permissionService.isLoaded()) {
      await permissionService.loadPermissions();
    }

    const permsArray = Array.isArray(permissions) ? permissions : [permissions];
    
    // Check if the user has AT LEAST ONE of the required permissions
    const hasAccess = permsArray.some(p => permissionService.hasPermission(p));

    if (!hasAccess) {
      return router.createUrlTree(['/403']);
    }

    return true;
  };
};
