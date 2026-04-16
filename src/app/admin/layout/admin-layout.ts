import { Component, inject, OnInit, OnDestroy, effect, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { AuthService } from '@app/core/services/auth.service';
import { NotificationService, AppNotification } from '@app/core/services/notification.service';
import { AccessibilitySidebarComponent } from '@app/shared/components/accessibility-sidebar/accessibility-sidebar.component';
import { PreferencesService } from '@app/shared/services/preferences.service';
import { BranchService, Branch } from '@app/core/services/branch.service';
import { signal } from '@angular/core';
import { ThemeService } from '@app/core/services/theme.service';
import { BranchContextService } from '@app/core/services/branch-context.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, AccessibilitySidebarComponent],
  templateUrl: './admin-layout.html',
})
export class AdminLayout implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  private router = inject(Router);
  private branchService = inject(BranchService);
  public preferencesService = inject(PreferencesService);
  public notificationService = inject(NotificationService);
  private themeService = inject(ThemeService);
  private branchContextService = inject(BranchContextService);

  public branches = signal<Branch[]>([]);
  public currentBranchId = this.branchService.currentBranchId;
  public currentAssignedBranch = signal<any | null>(null);
  public branchBranding = signal<{ logo: string | null, name: string }>({ 
    logo: '/assets/img/brands/logo/logo-normal.PNG', 
    name: 'Arecofix' 
  });

  menuItems: any[] = [];
  
  private cdr = inject(ChangeDetectorRef);

  get currentSelectedBranchId() {
    return this.branchService.currentBranch()?.id || '';
  }

  constructor() {
    effect(() => {
      const branch = this.branchService.currentBranch();
      const config = branch?.modules_config as any;
      const basePrefix = branch?.slug ? `/${branch.slug}/admin` : '/admin';
      
      const hasAccess = (modName?: string) => {
        if (!modName) return true;
        if (!config) return true;
        return config[modName] === undefined || config[modName] === true;
      };

      const baseItems = [
        { title: 'Dashboard', path: `${basePrefix}/dashboard`, icon: 'fa-chart-line', module: 'dashboard' },
        {
          title: 'Productos',
          path: `${basePrefix}/products`,
          icon: 'fa-box',
          expanded: false,
          module: 'inventory',
          children: [
            { title: 'Categorías', path: `${basePrefix}/categories`, icon: 'fa-tags', module: 'inventory' },
            { title: 'Marcas', path: `${basePrefix}/brands`, icon: 'fa-copyright', module: 'inventory' },
            { title: 'Inventario', path: `${basePrefix}/inventory`, icon: 'fa-warehouse', module: 'inventory' },
            { title: 'Ventas', path: `${basePrefix}/sales`, icon: 'fa-cash-register', module: 'inventory' },
            { title: 'Compras', path: `${basePrefix}/purchases`, icon: 'fa-shopping-bag', module: 'inventory' },
            { title: 'Pedidos', path: `${basePrefix}/orders`, icon: 'fa-shopping-cart', module: 'inventory' },
          ]
        },
        { title: 'Clientes', path: `${basePrefix}/clients`, icon: 'fa-users', module: 'customers' },
        {
          title: 'Empresa',
          path: `${basePrefix}/company`,
          icon: 'fa-building',
          expanded: false,
          children: [
            { title: 'Empleados', path: `${basePrefix}/employees`, icon: 'fa-id-card' },
            { title: 'Sucursales', path: `${basePrefix}/branches`, icon: 'fa-map-marker-alt' },
            { title: 'Proveedores', path: `${basePrefix}/suppliers`, icon: 'fa-truck' },
            { title: 'Facturación', path: `${basePrefix}/sales/invoices`, icon: 'fa-file-invoice-dollar' },
          ]
        },
        { title: 'Cursos', path: `${basePrefix}/courses`, icon: 'fa-graduation-cap' },
        { title: 'Servicios', path: `${basePrefix}/services`, icon: 'fa-tools' },
        { title: 'Taller', path: `${basePrefix}/repairs`, icon: 'fa-wrench', module: 'repairs' },
        { title: 'Usuarios', path: `${basePrefix}/users`, icon: 'fa-user-cog' },
        { title: 'Mensajes', path: `${basePrefix}/messages`, icon: 'fa-envelope' },
        { title: 'Entradas', path: `${basePrefix}/posts`, icon: 'fa-newspaper' },
      ];

      this.menuItems = baseItems.filter(item => {
        // Evaluate parent access
        const parentHasAccess = hasAccess(item.module);
        
        if (item.children) {
          // Filter accessible children
          item.children = item.children.filter(child => hasAccess((child as any).module));
          // If parent is allowed OR any child is allowed
          return parentHasAccess || item.children.length > 0;
        }
        
        return parentHasAccess;
      });
      
      // Force UI update since menuItems is not a signal
      this.cdr.markForCheck();
    });
  }

  toggleMenu(item: any) {
    if (item.children) {
      item.expanded = !item.expanded;
    }
  }

  private navigationSubscription = new Subscription();

  async ngOnInit() {
    this.themeService.forceLight.set(true);
    this.preferencesService.setForceLight(true);
    await this.notificationService.loadNotifications();
    this.notificationService.subscribeToRealtime();

    if (this.authService.isSuperAdmin()) {
      await this.loadAllBranches();

      // Check current route for branchSlug
      const urlSegments = this.router.url.split('/');
      // Expected: /:branchSlug/admin/...
      if (urlSegments.length > 1) {
        const potentialSlug = urlSegments[1];
        const branches = this.branches();
        const branch = branches.find(b => b.slug === potentialSlug);
        if (branch) {
          this.branchService.setCurrentBranch(branch); // This will update currentBranchId signal automatically
          this.updateBranding(branch);
        } else if (potentialSlug === 'admin') {
           this.branchService.setCurrentBranch(null);
           this.branchBranding.set({ logo: '/assets/img/brands/logo/logo-normal.PNG', name: 'Arecofix' });
        }
      }
    }

    // Listen to current assigned branch (SaaS isolation)
    this.navigationSubscription.add(
      this.authService.currentBranch$.subscribe(branch => {
        this.currentAssignedBranch.set(branch);
        if (branch && !this.authService.isSuperAdmin()) {
          this.updateBranding(branch);
        }
      })
    );

    // Auto-close accessibility sidebar and detect URL changes to keep context strictly synced
    this.navigationSubscription.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: any) => {
        this.preferencesService.closeSidebar();
        
        // Safely infer Global vs Branch from URL dynamically since Component isn't reliably destroyed
        const urlString = event.urlAfterRedirects || event.url;
        // The URL string often starts with a '/', so splitting by '/' makes urlSegments[1] the first path part.
        const urlSegments = urlString.split('/');
        if (urlSegments.length > 1 && urlSegments[1] === 'admin') {
           if (this.branchService.getCurrentBranchId() !== null) {
             console.log('🔄 Router detected Global /admin scope. Enforcing Global Branch cache reset.');
             this.branchService.setCurrentBranch(null);
             this.branchBranding.set({ logo: '/assets/img/brands/logo/logo-normal.PNG', name: 'Arecofix' });
           }
        }
      })
    );
  }

  async loadAllBranches() {
    const supabase = this.authService.getSupabaseClient();
    const { data } = await supabase.from('branches').select('*').eq('is_active', true);
    if (data) {
      this.branches.set(data);
    }
  }

  onBranchSelected(event: any) {
    const branchId = event.target.value;
    this.branchService.setBranchById(branchId);
    
    if (!branchId || branchId === 'global') {
      this.branchService.setCurrentBranch(null);
      this.router.navigate(['/admin/dashboard']);
      return;
    }
    
    // Find the branch slug to navigate to the correct admin URL
    const selectedBranch = this.branches().find(branch => branch.id === branchId);
    
    if (selectedBranch && selectedBranch.slug) {
      console.log(' Navigating to branch admin:', selectedBranch.slug);
      this.updateBranding(selectedBranch);
      this.router.navigate([`/${selectedBranch.slug}/admin/dashboard`]);
    } else {
      console.warn(' Branch not found or missing slug:', branchId);
      this.branchBranding.set({ logo: '/assets/img/brands/logo/logo-normal.PNG', name: 'Arecofix' });
    }
  }

  private updateBranding(branch: Branch) {
    this.branchBranding.set({
      logo: branch.branding_settings?.logo_url || '/assets/img/brands/logo/logo-normal.PNG',
      name: branch.official_name || branch.name || 'Arecofix'
    });
  }

  ngOnDestroy() {
    this.themeService.forceLight.set(false);
    this.preferencesService.setForceLight(false);
    this.notificationService.unsubscribe();
    this.navigationSubscription.unsubscribe();
  }

  handleNotificationClick(notif: AppNotification) {
    if (!notif.is_read) {
      this.notificationService.markAsRead(notif.id);
    }
    if (notif.link) {
      this.router.navigateByUrl(notif.link);
    }
  }

  async logout() {
    await this.authService.signOut();
    this.router.navigate(['/login']);
  }
}