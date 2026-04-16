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

  // 3. Obtener la sucursal actual
  const currentBranch = branchService.currentBranch();
  
  if (!currentBranch) {
    // Si no hay sucursal cargada aún (ej: recarga de página), 
    // esperamos un breve momento o dejamos pasar al branchAdminGuard (que carga la sucursal)
    // En este sistema, branchAdminGuard se ejecuta antes.
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
  router.navigate(['/upgrade-required'], { queryParams: { module: requiredModule } });
  return false;
};
