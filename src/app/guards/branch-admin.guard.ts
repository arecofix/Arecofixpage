import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { ROLES } from '@app/core/constants/roles.constants';

/**
 * Guard para proteger rutas administrativas de sucursales (ej: /larrea/admin)
 * - Super Admin (por email o rol) tiene acceso global a cualquier sucursal
 * - Admin/Tenant Owner tienen acceso global a cualquier sucursal
 * - Staff solo pasa si su profile.branch_id (o slug asociado) coincide con la ruta.
 */
export const branchAdminGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
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
    console.log('👤 User ID:', userId);
    
    const userProfile = await authService.getUserProfile(userId);
    
    if (!userProfile) {
      console.warn('🚫 No user profile found, redirecting to home');
      router.navigate(['/']);
      return false;
    }

    const role = userProfile.role || ROLES.USER;
    const userEmail = userProfile.email;
    
    console.log('📋 User profile:', {
      email: userEmail,
      role: role,
      tenantId: userProfile.tenant_id,
      branchId: userProfile.branch_id,
      isSuperAdmin: authService.isSuperAdmin()
    });

    // Super Admin por email o señal tiene acceso global a cualquier sucursal
    if (authService.isSuperAdmin() || 
        userEmail === 'ezequielenrico15@gmail.com' || 
        role === ROLES.SUPER_ADMIN || 
        role === ROLES.ADMIN || 
        role === ROLES.TENANT_OWNER) {
      console.log('🔓 Super Admin access granted for branch:', route.paramMap.get('branchSlug'));
      return true;
    }

    // Staff solo accede a su propia sucursal
    if (role === (ROLES.STAFF as string)) {
      const branchSlug = route.paramMap.get('branchSlug');
      
      if (!branchSlug) {
        // Fallback: si no hay sucursal en la URL
        console.warn('⚠️ No branch slug found in route for staff user');
        return false;
      }

      // 1. Obtenemos el branch_id del perfil
      const userBranchId = userProfile.branch_id;
      if (!userBranchId) {
        console.warn('⚠️ Staff user has no branch assigned');
        router.navigate(['/']);
        return false;
      }

      // 2. Verificamos si ese branch_id corresponde al slug de la URL
      const supabase = authService.getSupabaseClient();
      const { data: branch, error } = await supabase
        .from('branches')
        .select('slug')
        .eq('id', userBranchId)
        .maybeSingle();

      if (!error && branch && branch.slug === branchSlug) {
        console.log('✅ Staff access granted for own branch:', branchSlug);
        return true;
      } else {
        console.warn('⚠️ Staff trying to access unauthorized branch:', branchSlug);
      }
    }

    // Denegado para otros roles o si la validación falló
    console.warn('🚫 Access denied for user:', userEmail, 'role:', role);
    router.navigate(['/']);
    return false;

  } catch (error) {
    console.error('❌ Error in branchAdminGuard:', error);
    router.navigate(['/']);
    return false;
  }
};
