import { Component, OnInit, OnDestroy, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { BranchService } from '@app/core/services/branch.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { UserProfile } from '@app/shared/interfaces/user.interface';
import { Branch } from '@app/shared/interfaces/branch.interface';
import { PreferencesService } from '@app/shared/services/preferences.service';
import { NotificationService } from '@app/core/services/notification.service';
import { AccessibilitySidebarComponent } from '@app/shared/components/accessibility-sidebar/accessibility-sidebar.component';
import { toSignal } from '@angular/core/rxjs-interop';

interface MenuItem {
  title: string;
  path?: string;
  icon: string;
  expanded?: boolean;
  children?: MenuItem[];
  module?: string;
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    AccessibilitySidebarComponent
  ],
  templateUrl: './admin-layout.html',
})
export class AdminLayout implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  public branchService = inject(BranchService);
  public notificationService = inject(NotificationService);
  private router = inject(Router);
  public preferencesService = inject(PreferencesService);
  private cdr = inject(ChangeDetectorRef);

  // Convert observables to signals for easier template usage and type safety
  public highContrast = toSignal(this.preferencesService.highContrast$, { initialValue: false });
  public fontSize = toSignal(this.preferencesService.fontSize$, { initialValue: 16 });

  navigationItems: MenuItem[] = [];
  branches = signal<Branch[]>([]);
  currentBranchId = signal<string | null>(null);
  currentAssignedBranch = signal<Branch | null>(null);
  userProfile = signal<UserProfile | null>(null);
  branchBranding = signal<{ logo: string; name: string }>({
    logo: '/assets/img/brands/logo/logo-normal.PNG',
    name: 'Arecofix'
  });

  private navigationSubscription = new Subscription();

  async ngOnInit() {
    // Escuchar la sucursal actual desde el servicio de autenticación
    this.navigationSubscription.add(
      this.authService.currentBranch$.subscribe((branch: Branch | null) => {
        this.currentBranchId.set(branch?.id || null);
        this.updateBranchMenu(branch);
      })
    );

    // Escuchar cambios en el estado de autenticación (perfil, usuario)
    this.navigationSubscription.add(
      this.authService.authState$.subscribe(state => {
        this.userProfile.set(state.profile);
      })
    );

    if (this.authService.isSuperAdmin()) {
      await this.loadAllBranches();
    }

    // Inicializar notificaciones
    this.notificationService.loadNotifications();
    this.notificationService.subscribeToRealtime();

    this.navigationSubscription.add(
      this.authService.currentBranch$.subscribe((branch: Branch | null) => {
        this.currentAssignedBranch.set(branch);
        if (branch) {
          if (!this.authService.isSuperAdmin()) {
             this.updateBranding(branch);
             this.branchService.setCurrentBranch(branch);
          } else {
            const currentSelectedId = this.branchService.getCurrentBranchId();
            if (!currentSelectedId) {
               this.branchService.setCurrentBranch(branch);
               this.updateBranding(branch);
            }
          }
        }
      })
    );

    this.navigationSubscription.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: any) => {
        this.preferencesService.closeSidebar();
        const urlString = event.urlAfterRedirects || event.url;
        const urlSegments = urlString.split('/');
        if (urlSegments.length === 2 && urlSegments[1] === 'admin') {
           if (this.branchService.getCurrentBranchId() !== null) {
             this.branchService.setCurrentBranch(null);
             this.updateBranding(null);
           }
        }
      })
    );
  }

  updateBranchMenu(branch: Branch | null) {
    const basePrefix = branch?.slug ? `/${branch.slug}/admin` : '/admin';
    const config = (this.authService as any).getTenantConfig?.() || {};
    
    const hasAccess = (modName?: string) => {
      if (!modName) return true;
      if (!config) return true;
      return config[modName] === undefined || config[modName] === true;
    };

    const companyChildren: MenuItem[] = [];
    if (!branch) {
      companyChildren.push({ title: 'Gestión Red de Sucursales', path: '/admin/branches', icon: 'fa-sitemap' });
    } else {
      companyChildren.push({ title: 'Identidad de Empresa', path: `${basePrefix}/branches`, icon: 'fa-id-badge' });
    }
    companyChildren.push(
      { title: 'Gestión de Staff', path: `${basePrefix}/employees`, icon: 'fa-id-card' },
      { title: 'Proveedores & Contactos', path: `${basePrefix}/suppliers`, icon: 'fa-truck' },
      { title: 'Control de Usuarios', path: `${basePrefix}/users`, icon: 'fa-user-cog' }
    );

    const baseItems: MenuItem[] = [
      { title: 'Panel de Control', path: `${basePrefix}/dashboard`, icon: 'fa-chart-line', module: 'dashboard' },
      { 
        title: 'Inventario & Catálogo', 
        path: `${basePrefix}/products`,
        icon: 'fa-cubes', 
        module: 'inventory',
        expanded: true,
        children: [
          { title: 'Catálogo Maestro', path: `${basePrefix}/products`, icon: 'fa-barcode' },
          { title: 'Stock & Almacén', path: `${basePrefix}/inventory`, icon: 'fa-warehouse' },
          { title: 'Audit Catálogo Meta', path: `${basePrefix}/products/approvals`, icon: 'fa-check-double' },
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
      { title: 'Academia Arecofix', path: `${basePrefix}/courses`, icon: 'fa-graduation-cap' },
    ];

    const planId = (branch?.plan_id || 'basic').toLowerCase();
    const isBasicBranch = branch !== null && (planId === 'basic' || planId === 'free' || planId === 'standard');

    this.navigationItems = baseItems
      .filter(item => {
        if (isBasicBranch) {
          if (['Academia Arecofix', 'Marketing & Contenido'].includes(item.title)) return false;
        }
        return hasAccess(item.module);
      })
      .map(item => {
        if (!item.children) return item;

        const filteredChildren = item.children.filter(child => {
          if (isBasicBranch) {
            if (['Gestión Red de Sucursales', 'Proveedores & Contactos'].includes(child.title)) return false;
          }
          return hasAccess(child.module);
        });

        return { ...item, children: filteredChildren };
      })
      .filter(item => !item.children || item.children.length > 0);

    this.cdr.markForCheck();
  }

  trackByMenu(index: number, item: MenuItem) {
    return item.title + index;
  }

  isSuperAdmin() {
    return this.authService.isSuperAdmin();
  }

  async logout() {
    await this.authService.signOut();
    this.router.navigate(['/']);
  }

  async handleNotificationClick(notif: any) {
    await this.notificationService.markAsRead(notif.id);
    if (notif.payload?.route) {
      this.router.navigate([notif.payload.route]);
    }
  }

  async loadAllBranches() {
    const data = await this.branchService.getAllAdminBranches();
    this.branches.set(data);
    this.cdr.markForCheck();
  }

  ngOnDestroy() {
    this.navigationSubscription.unsubscribe();
    this.notificationService.unsubscribe();
  }

  onBranchSelected(event: Event) {
    const branchId = (event.target as HTMLSelectElement).value;
    if (!branchId) {
      this.branchService.setCurrentBranch(null);
      this.updateBranding(null);
      this.router.navigate(['/admin']);
      return;
    }
    const branch = this.branches().find(b => b.id === branchId);
    if (branch) {
      this.branchService.setCurrentBranch(branch);
      this.updateBranding(branch);
      this.router.navigate([`/${branch.slug}/admin`]);
    }
  }

  onParentClick(item: MenuItem) {
    item.expanded = !item.expanded;
    if (item.path) {
      this.router.navigate([item.path]);
    }
    this.cdr.markForCheck();
  }

  private updateBranding(branch: Branch | null) {
    if (!branch) {
      this.branchBranding.set({
        logo: '/assets/img/brands/logo/logo-normal.PNG',
        name: 'ARECOFIX CENTRAL'
      });
      document.documentElement.style.removeProperty('--primary-branch-color');
      return;
    }

    const branding = branch.branding_settings as any;
    this.branchBranding.set({
      logo: branding?.logo_url || '/assets/img/brands/logo/logo-normal.PNG',
      name: branch.name
    });

    if (branding?.primary_color) {
      document.documentElement.style.setProperty('--primary-branch-color', branding.primary_color);
    } else {
      document.documentElement.style.removeProperty('--primary-branch-color');
    }
  }

  toggleSidebar() {
    this.preferencesService.toggleSidebar();
  }
}