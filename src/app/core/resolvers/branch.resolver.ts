import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { BranchService, Branch } from '@app/core/services/branch.service';

export const BranchResolver: ResolveFn<Branch | null> = async (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
) => {
  const branchService = inject(BranchService);
  const router = inject(Router);

  // Con custom URL matchers, Angular expone posParams en route.params (no en paramMap)
  const slug = route.params['branchSlug'] ?? route.paramMap.get('branchSlug');

  if (!slug) {
    router.navigate(['/']);
    return null;
  }

  try {
    const branch = await branchService.getBranchBySlug(slug);
    if (!branch) {
      // Sucursal no encontrada o inactiva — redirigir a home limpiamente
      router.navigate(['/']);
      return null;
    }
    return branch;
  } catch (error) {
    console.error('[BranchResolver] Error fetching branch data:', error);
    router.navigate(['/']);
    return null;
  }
};
