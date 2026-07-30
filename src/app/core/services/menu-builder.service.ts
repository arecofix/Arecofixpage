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
    lang: 'es' | 'en' = 'es',
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
      { title: lang === 'es' ? 'Identidad de Empresa' : 'Company Identity', path: `${basePrefix}/company`, icon: 'fa-id-badge' }
    ];

    if (isGlobalAdmin && isCentral) {
      companyChildren.push({ title: lang === 'es' ? 'Gestión Red de Sucursales' : 'Branch Network Management', path: `${basePrefix}/branches`, icon: 'fa-sitemap' });
    }

    const baseItems: MenuItem[] = [
      { title: lang === 'es' ? 'Panel de Control' : 'Dashboard', path: `${basePrefix}/dashboard`, icon: 'fa-chart-line', module: 'dashboard' },
      { 
        title: lang === 'es' ? 'Inventario & Catálogo' : 'Inventory & Catalog', 
        path: `${basePrefix}/products`,
        icon: 'fa-cubes', 
        module: 'inventory',
        expanded: true,
        children: [
          { title: lang === 'es' ? 'Gestión de Productos' : 'Product Management', path: `${basePrefix}/products`, icon: 'fa-barcode' },
          { title: lang === 'es' ? 'Stock & Almacén' : 'Stock & Warehouse', path: `${basePrefix}/inventory`, icon: 'fa-warehouse' },
          { title: lang === 'es' ? 'Auditar Catálogo' : 'Audit Catalog', path: `${basePrefix}/products/approvals`, icon: 'fa-check-double' },
          { title: lang === 'es' ? 'Categorías de Venta' : 'Sales Categories', path: `${basePrefix}/categories`, icon: 'fa-tags' },
          { title: lang === 'es' ? 'Marcas / Fabricantes' : 'Brands / Manufacturers', path: `${basePrefix}/brands`, icon: 'fa-copyright' },
        ]
      },
      { 
        title: lang === 'es' ? 'Ventas & Operaciones' : 'Sales & Operations', 
        path: `${basePrefix}/sales`,
        icon: 'fa-cash-register', 
        module: 'inventory',
        expanded: false,
        children: [
          { title: lang === 'es' ? 'Terminal de Venta' : 'Point of Sale (POS)', path: `${basePrefix}/sales`, icon: 'fa-plus-circle' },
          { title: lang === 'es' ? 'Pedidos & E-commerce' : 'Orders & E-commerce', path: `${basePrefix}/orders`, icon: 'fa-shopping-cart' },
          { title: lang === 'es' ? 'Historial de Facturación' : 'Billing History', path: `${basePrefix}/sales/invoices`, icon: 'fa-file-invoice-dollar' },
          { title: lang === 'es' ? 'Egresos / Compras' : 'Expenses / Purchases', path: `${basePrefix}/purchases`, icon: 'fa-shopping-bag' },
        ]
      },
      {
        title: lang === 'es' ? 'Gestión Financiera' : 'Financial Management',
        icon: 'fa-chart-pie',
        expanded: false,
        children: [
          { title: lang === 'es' ? 'Dashboard Contable' : 'Accounting Dashboard', path: `${basePrefix}/finance/dashboard`, icon: 'fa-chart-bar' },
          { title: lang === 'es' ? 'Movimientos de Caja' : 'Cash Movements', path: `${basePrefix}/finance/cash-movements`, icon: 'fa-money-bill-wave' }
        ]
      },
      {
        title: lang === 'es' ? 'Servicio Técnico' : 'Technical Service',
        icon: 'fa-wrench',
        module: 'repairs',
        expanded: false,
        children: [
          { title: lang === 'es' ? 'Lista de Reparaciones' : 'Repairs List', path: `${basePrefix}/repairs`, icon: 'fa-tools' },
          { title: lang === 'es' ? 'Reservas de Turno' : 'Reservations', path: `${basePrefix}/reservations`, icon: 'fa-calendar-check' }
        ]
      },
      { title: lang === 'es' ? 'Gestión de Personas y Clientes' : 'People & Customer Management', path: `${basePrefix}/users`, icon: 'fa-users', module: 'customers' },
      {
        title: lang === 'es' ? 'Configuración Empresa' : 'Company Settings',
        icon: 'fa-building',
        expanded: false,
        children: companyChildren
      },
      { 
        title: lang === 'es' ? 'Marketing & Contenido' : 'Marketing & Content', 
        icon: 'fa-bullhorn', 
        expanded: false, 
        children: [
          { title: lang === 'es' ? 'Servicios Web' : 'Web Services', path: `${basePrefix}/services`, icon: 'fa-tools' },
          { title: lang === 'es' ? 'Blog & Noticias' : 'Blog & News', path: `${basePrefix}/posts`, icon: 'fa-newspaper' },
          { title: lang === 'es' ? 'Mensajes Recibidos' : 'Received Messages', path: `${basePrefix}/messages`, icon: 'fa-envelope' },
        ]
      },
      { 
        title: lang === 'es' ? 'Academia Arecofix' : 'Arecofix Academy', 
        icon: 'fa-graduation-cap', 
        module: 'academia',
        expanded: false,
        children: [
          { title: lang === 'es' ? 'Cursos' : 'Courses', path: `${basePrefix}/courses`, icon: 'fa-book' },
          { title: lang === 'es' ? 'Solicitudes' : 'Requests', path: `${basePrefix}/courses/solicitudes`, icon: 'fa-user-graduate' }
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
