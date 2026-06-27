import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { TenantService } from '@app/core/services/tenant.service';
import { SUBSCRIPTION_STATUS } from '@app/core/constants/tenant.constants';

export const tenantStatusGuard: CanActivateFn = async (route, state) => {
  const tenantService = inject(TenantService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const tenant = tenantService.getCurrentTenant();
  if (tenant) {
    if (tenant.is_active === false) {
      console.warn(`🚫 tenantStatusGuard: Tenant is suspended (is_active=false). Redirecting to login.`);
      await authService.signOut();
      return router.createUrlTree(['/login'], { queryParams: { error: 'tenant_suspended' } });
    }
    if ([SUBSCRIPTION_STATUS.OVERDUE, SUBSCRIPTION_STATUS.CANCELED, SUBSCRIPTION_STATUS.SUSPENDED].includes(tenant.subscription_status || '')) {
      console.warn(`🚫 tenantStatusGuard: Tenant subscription is ${tenant.subscription_status}. Redirecting to payment.`);
      return router.createUrlTree(['/payment-required']);
    }
  }

  return true;
};
