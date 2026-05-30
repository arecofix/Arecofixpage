import { Component, OnInit, OnDestroy, inject, signal, ChangeDetectorRef, effect } from '@angular/core';
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
import { LockScreenComponent } from '@app/shared/components/lock-screen/lock-screen.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { TabService } from '@app/core/services/tab.service';
import { FavoritesService, FavoriteItem } from '@app/core/services/favorites.service';
import { TenantService } from '@app/core/services/tenant.service';

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
    AccessibilitySidebarComponent,
    LockScreenComponent
  ],
  templateUrl: './admin-layout.html',
})
export class AdminLayout implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  public branchService = inject(BranchService);
  public tenantService = inject(TenantService);
  public notificationService = inject(NotificationService);
  public router = inject(Router);
  public preferencesService = inject(PreferencesService);
  private cdr = inject(ChangeDetectorRef);
  public tabService = inject(TabService);
  public favoritesService = inject(FavoritesService);

  // Convert observables to signals for easier template usage and type safety
  public highContrast = toSignal(this.preferencesService.highContrast$, { initialValue: false });
  public fontSize = toSignal(this.preferencesService.fontSize$, { initialValue: 16 });

  navigationItems: MenuItem[] = [];
  branches = signal<Branch[]>([]);
  currentBranchId = this.branchService.currentBranchId;
  currentAssignedBranch = signal<Branch | null>(null);
  userProfile = signal<UserProfile | null>(null);
  isMainMenuOpen = signal(true);
  branchBranding = signal<{ logo: string; name: string }>({
    logo: '/assets/img/brands/logo/logo-normal.PNG',
    name: 'Arecofix'
  });

  private navigationSubscription = new Subscription();

  constructor() {
    effect(() => {
      const branch = this.branchService.currentBranch();
      console.log('[AdminLayout] Active branch changed dynamically:', branch?.name || 'Sede Central');
      this.updateBranchMenu(branch);
      this.updateBranding(branch);
    });
  }

  async ngOnInit() {

    // Escuchar cambios en el estado de autenticación (perfil, usuario)
    this.navigationSubscription.add(
      this.authService.authState$.subscribe(async state => {
        this.userProfile.set(state.profile);
        
        // Load branches if SuperAdmin, Tenant Owner, or Admin
        const role = state.profile?.role;
        if (this.authService.isSuperAdmin() || role === 'tenant_owner') {
          await this.loadAllBranches();
        }
      })
    );

    // Inicializar notificaciones
    this.notificationService.loadNotifications();
    this.notificationService.subscribeToRealtime();

    // 2. Escuchar la sucursal asignada del perfil para inicializar el contexto correcto en el primer arranque
    this.navigationSubscription.add(
      this.authService.currentBranch$.subscribe((assignedBranch: Branch | null) => {
        this.currentAssignedBranch.set(assignedBranch);
        if (assignedBranch) {
          // Ensure the assigned branch is in the dropdown options even if loadAllBranches wasn't called or missed it
          if (!this.branches().find(b => b.id === assignedBranch.id)) {
            this.branches.update(list => [...list, assignedBranch]);
          }
          
          if (!this.authService.isSuperAdmin()) {
             this.branchService.setCurrentBranch(assignedBranch);
          } else {
            const currentSelectedId = this.branchService.getCurrentBranchId();
            if (!currentSelectedId) {
               this.branchService.setCurrentBranch(assignedBranch);
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
        // Split and filter out empty segments to handle leading slashes cleanly
        const urlSegments = urlString.split('/').filter((s: string) => s);
        
        // Sede Central detect: first path segment is 'admin' (e.g., /admin/dashboard)
        const isSedeCentralUrl = urlSegments.length > 0 && urlSegments[0] === 'admin';

        if (isSedeCentralUrl) {
           if (this.branchService.getCurrentBranchId() !== null) {
             console.log('[AdminLayout NavigationEnd] Sede Central detected. Resetting active branch to Central (null)');
             this.branchService.setCurrentBranch(null);
             this.updateBranding(null);
           }
        }
      })
    );
  }

  updateBranchMenu(branch: Branch | null) {
    const basePrefix = branch?.slug ? `/${branch.slug}/admin` : '/admin';
    const tenantConfig = (this.authService as any).getTenantConfig?.() || {};
    const branchConfig = branch?.modules_config || {};
    
    const hasAccess = (modName?: string) => {
      if (!modName) return true;
      
      // 1. Check branch-level override first (modules_config jsonb)
      if ((branchConfig as any)[modName] === false) return false;
      
      // 2. Fallback to tenant-level config
      if (!tenantConfig) return true;
      return tenantConfig[modName] !== false;
    };

    const profile = this.authService.getCurrentProfile();
    const isGlobalAdmin = this.authService.isSuperAdmin() || profile?.role === 'tenant_owner';
    const isCentral = !branch || branch.slug === 'arecofix' || branch.id === 'de967f68-7b15-44c0-bc98-952ccf06e1e5';

    const companyChildren: MenuItem[] = [];
    companyChildren.push({ title: 'Identidad de Empresa', path: `${basePrefix}/company`, icon: 'fa-id-badge' });

    if (isGlobalAdmin && isCentral) {
      companyChildren.push({ title: 'Gestión Red de Sucursales', path: '/admin/branches', icon: 'fa-sitemap' });
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
      { title: 'Academia Arecofix', path: `${basePrefix}/courses`, icon: 'fa-graduation-cap', module: 'academia' },
    ];

    const planId = (branch?.plan_id || 'basic').toLowerCase();
    const isBasicBranch = branch !== null && (planId === 'basic' || planId === 'free' || planId === 'standard');
    const isLibreriaZaona = branch?.slug?.toLowerCase()?.includes('zaona') || branch?.name?.toLowerCase()?.includes('zaona');

    this.navigationItems = baseItems
      .filter(item => {
        if (isBasicBranch) {
          if (['Academia Arecofix', 'Marketing & Contenido'].includes(item.title)) return false;
        }
        if (isLibreriaZaona) {
          if (['Servicio Técnico', 'Academia Arecofix'].includes(item.title)) return false;
        }
        return hasAccess(item.module);
      })
      .map(item => {
        if (!item.children) return item;

        const filteredChildren = item.children.filter(child => {
          if (isBasicBranch) {
            if (['Gestión Red de Sucursales', 'Proveedores & Contactos'].includes(child.title)) return false;
          }
          if (isLibreriaZaona) {
            if (['Servicios Web', 'Auditar Catálogo', 'Blog & Noticias', 'Mensajes Recibidos'].includes(child.title)) return false;
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

  canSwitchBranch() {
    const role = this.userProfile()?.role;
    return this.isSuperAdmin() || role === 'tenant_owner';
  }

  isLibreriaZaona(): boolean {
    const branch = this.branchService.currentBranch();
    return !!(branch?.slug?.toLowerCase()?.includes('zaona') || branch?.name?.toLowerCase()?.includes('zaona'));
  }

  async logout() {
    await this.authService.signOut();
    this.router.navigate(['/login']);
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
      const tenant = this.tenantService.getCurrentTenant();
      const tenantName = tenant ? tenant.name.toUpperCase() : 'ARECOFIX CENTRAL';
      this.branchBranding.set({
        logo: '/assets/img/brands/logo/logo-normal.PNG',
        name: tenantName
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

  toggleMainMenu() {
    this.isMainMenuOpen.update(v => !v);
  }

  toggleCurrentFavorite() {
    const url = this.router.url;
    let title = 'Favorito';
    
    // Find current route title
    let currentRoute = this.router.routerState.root;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }
    title = currentRoute.snapshot.data['title'] || currentRoute.snapshot.routeConfig?.title || 'Favorito';

    this.favoritesService.toggleFavorite({ url, title });
  }

  isCurrentFavorite(): boolean {
    return this.favoritesService.isFavorite(this.router.url);
  }
}