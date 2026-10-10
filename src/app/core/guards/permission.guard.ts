import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionService } from '../services/permission.service';

export const permissionGuard = (permissions: string | string[]): CanActivateFn => {
  return async (route, state) => {
    const permissionService = inject(PermissionService);
    const router = inject(Router);

    // If permissions aren't loaded yet (e.g. direct URL hit), we should probably wait
    // We can call loadPermissions here if not loaded, or assume auth guard handles it.
    // Assuming auth guard happens first, permissionService should ideally be loaded.
    if (!permissionService.isLoaded()) {
       await permissionService.loadPermissions();
    }

    const permsArray = Array.isArray(permissions) ? permissions : [permissions];
    
    // Check if the user has AT LEAST ONE of the required permissions
    const hasAccess = permsArray.some(p => permissionService.hasPermission(p));

    if (!hasAccess) {
      // Redirect to a 403 Forbidden page or dashboard
      return router.createUrlTree(['/403']); // assuming 403 route exists, else fallback to home
    }

    return true;
  };
};
