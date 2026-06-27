import { Injectable, inject } from '@angular/core';
import { Branch } from '@app/shared/interfaces/branch.interface';
import { AuthService } from '@app/core/services/auth.service';

export interface MenuItem {
  title: string;
  path?: string;
  icon: string;
  expanded?: boolean;
  children?: MenuItem[];
  module?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MenuBuilderService {
  private authService = inject(AuthService);

  public buildMenuForBranch(
    branch: Branch | null, 
    currentItemsState: MenuItem[] = []
  ): MenuItem[] {
    const basePrefix = branch?.slug ? `/${branch.slug}/admin` : '/admin';
    const tenantConfig = (this.authService as any).getTenantConfig?.() || {};
    const branchConfig = branch?.modules_config || {};
    
    const hasAccess = (modName?: string) => {
      if (!modName) return true;
      if ((branchConfig as any)[modName] === false) return false;
      if (!tenantConfig) return true;
      return tenantConfig[modName] !== false;
    };

    const profile = this.authService.getCurrentProfile();
    const isGlobalAdmin = this.authService.isSuperAdmin() || profile?.role === 'tenant_owner';
    const isCentral = !branch || branch.slug === 'arecofix' || branch.id === 'de967f68-7b15-44c0-bc98-952ccf06e1e5';

    const companyChildren: MenuItem[] = [
      { title: 'Identidad de Empresa', path: `${basePrefix}/company`, icon: 'fa-id-badge' }
    ];

    if (isGlobalAdmin && isCentral) {
      companyChildren.push({ title: 'Gestión Red de Sucursales', path: `${basePrefix}/branches`, icon: 'fa-sitemap' });
      companyChildren.push({ title: 'Gestión de Personas', path: `${basePrefix}/users`, icon: 'fa-user-cog' });
    }

    const baseItems: MenuItem[] = [
      { title: 'Panel de Control', path: `${basePrefix}/dashboard`, icon: 'fa-chart-line', module: 'dashboard' },
      { 
        title: 'Inventario & Catálogo', 
        path: `${basePrefix}/products`,
        icon: 'fa-cubes', 
        module: 'inventory',
        expanded: true,
        children: [
          { title: 'Gestión de Productos', path: `${basePrefix}/products`, icon: 'fa-barcode' },
          { title: 'Stock & Almacén', path: `${basePrefix}/inventory`, icon: 'fa-warehouse' },
          { title: 'Auditar Catálogo', path: `${basePrefix}/products/approvals`, icon: 'fa-check-double' },
          { title: 'Categorías de Venta', path: `${basePrefix}/categories`, icon: 'fa-tags' },
          { title: 'Marcas / Fabricantes', path: `${basePrefix}/brands`, icon: 'fa-copyright' },
        ]
      },
      { 
        title: 'Ventas & Operaciones', 
        path: `${basePrefix}/sales`,
        icon: 'fa-cash-register', 
        module: 'inventory',
        expanded: false,
        children: [
          { title: 'Terminal de Venta', path: `${basePrefix}/sales`, icon: 'fa-plus-circle' },
          { title: 'Pedidos & E-commerce', path: `${basePrefix}/orders`, icon: 'fa-shopping-cart' },
          { title: 'Historial de Facturación', path: `${basePrefix}/sales/invoices`, icon: 'fa-file-invoice-dollar' },
          { title: 'Egresos / Compras', path: `${basePrefix}/purchases`, icon: 'fa-shopping-bag' },
        ]
      },
      {
        title: 'Gestión Financiera',
        icon: 'fa-chart-pie',
        expanded: false,
        children: [
          { title: 'Dashboard Contable', path: `${basePrefix}/finance/dashboard`, icon: 'fa-chart-bar' },
          { title: 'Movimientos de Caja', path: `${basePrefix}/finance/cash-movements`, icon: 'fa-money-bill-wave' }
        ]
      },
      { title: 'Servicio Técnico', path: `${basePrefix}/repairs`, icon: 'fa-wrench', module: 'repairs' },
      { title: 'Gestión de Clientes', path: `${basePrefix}/clients`, icon: 'fa-users', module: 'customers' },
      {
        title: 'Configuración Empresa',
        icon: 'fa-building',
        expanded: false,
        children: companyChildren
      },
      { 
        title: 'Marketing & Contenido', 
        icon: 'fa-bullhorn', 
        expanded: false, 
        children: [
          { title: 'Servicios Web', path: `${basePrefix}/services`, icon: 'fa-tools' },
          { title: 'Blog & Noticias', path: `${basePrefix}/posts`, icon: 'fa-newspaper' },
          { title: 'Mensajes Recibidos', path: `${basePrefix}/messages`, icon: 'fa-envelope' },
        ]
      },
      { 
        title: 'Academia Arecofix', 
        icon: 'fa-graduation-cap', 
        module: 'academia',
        expanded: false,
        children: [
          { title: 'Cursos', path: `${basePrefix}/courses`, icon: 'fa-book' },
          { title: 'Solicitudes', path: `${basePrefix}/courses/solicitudes`, icon: 'fa-user-graduate' }
        ]
      },
    ];

    // Remove the hardcoded LibreriaZaona and isBasicBranch logic.
    // Instead, rely strictly on module configurations defined in hasAccess().
    
    return baseItems
      .filter(item => hasAccess(item.module))
      .map(item => {
        if (!item.children) return item;

        const filteredChildren = item.children.filter(child => hasAccess(child.module));

        // Preserve the expanded state so the menu doesn't collapse/restart when route changes
        const existingItem = currentItemsState.find(n => n.title === item.title);
        const expanded = existingItem !== undefined ? existingItem.expanded : item.expanded;

        return { ...item, expanded, children: filteredChildren };
      })
      .filter(item => !item.children || item.children.length > 0);
  }
}
