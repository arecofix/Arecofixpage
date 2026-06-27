import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { BranchService } from '@app/core/services/branch.service';
import { AuthService } from '@app/core/services/auth.service';

/**
 * Guard para verificar si una sucursal tiene acceso a un módulo específico
 * basado en su modules_config.
 * 
 * Uso en rutas: data: { module: 'inventory' | 'repairs' | 'customers' }
 */
export const moduleGuard: CanActivateFn = async (route, state) => {
  const branchService = inject(BranchService);
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. SuperAdmin siempre tiene acceso
  if (authService.isSuperAdmin()) {
    return true;
  }

  // 2. Obtener el módulo requerido desde la data de la ruta
  const requiredModule = route.data['module'] as string;
  if (!requiredModule) {
    return true; // Si no hay módulo definido, permitimos el paso
  }

  // 3. Obtener la sucursal actual, esperando si es necesario
  let currentBranch = branchService.currentBranch();
  
  if (!currentBranch) {
    // SECURITY FIX: Si la sucursal aún no se cargó (ej. recarga de página), 
    // debemos esperar a que branchAdminGuard (u otro inicializador) la cargue.
    const savedId = localStorage.getItem('arecofix_admin_branch_id');
    if (savedId) {
      await branchService.setBranchById(savedId);
      currentBranch = branchService.currentBranch();
    }
  }

  // Si a pesar de esperar no hay sucursal, es porque no está logueado correctamente, dejamos pasar al auth guard
  if (!currentBranch) {
    return true; 
  }

  // 4. Verificar configuración
  const config = currentBranch.modules_config;
  
  // Si no hay config o está vacía, permitimos acceso por defecto (Plan Full)
  if (!config || Object.keys(config).length === 0) {
    return true;
  }

  // Verificar si el módulo está explícitamente desactivado
  // Si el campo no existe (undefined), permitimos el acceso para compatibilidad.
  const moduleSetting = (config as any)[requiredModule];
  const hasAccess = moduleSetting === undefined || moduleSetting === true;

  if (hasAccess) {
    return true;
  }

  console.warn(`🚫 Acceso denegado al módulo [${requiredModule}] para la sucursal [${currentBranch.slug}]`);
  
  // Redirigir a la página de upgrade con el nombre del módulo como parámetro
  return router.createUrlTree(['/upgrade-required'], { queryParams: { module: requiredModule } });
};
