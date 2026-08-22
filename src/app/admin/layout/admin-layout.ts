import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  ChangeDetectorRef,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
  NavigationEnd,
} from '@angular/router';
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
import {
  FavoritesService,
  FavoriteItem,
} from '@app/core/services/favorites.service';
import { TenantService } from '@app/core/services/tenant.service';
import {
  MenuBuilderService,
  MenuItem,
} from '@app/core/services/menu-builder.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    AccessibilitySidebarComponent,
    LockScreenComponent,
  ],
  templateUrl: './admin-layout.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      :host-context(body.is-tauri) .drawer-side,
      :host-context(body.is-tauri) .drawer-open > .drawer-side {
        height: calc(100vh - 65px) !important;
        top: 65px !important;
      }
      :host-context(body.is-tauri) .drawer-content.h-screen {
        height: calc(100vh - 65px) !important;
      }
    `,
  ],
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
  public menuBuilder = inject(MenuBuilderService);

  // Convert observables to signals for easier template usage and type safety
  public highContrast = toSignal(this.preferencesService.highContrast$, {
    initialValue: false,
  });
  public fontSize = toSignal(this.preferencesService.fontSize$, {
    initialValue: 16,
  });
  public currentLang = toSignal(this.preferencesService.language$, {
    initialValue: 'es' as 'es' | 'en',
  });

  navigationItems: MenuItem[] = [];
  branches = signal<Branch[]>([]);
  currentBranchId = this.branchService.currentBranchId;
  currentAssignedBranch = signal<Branch | null>(null);
  userProfile = signal<UserProfile | null>(null);
  isMainMenuOpen = signal(true);
  isNotifOpen = signal(false);
  branchBranding = signal<{ logo: string; name: string }>({
    logo: '/assets/img/brands/logo/logo-normal.PNG',
    name: 'Arecofix',
  });

  private navigationSubscription = new Subscription();

  constructor() {
    effect(() => {
      const branch = this.branchService.currentBranch();
      const lang = this.currentLang();
      // console.log('[AdminLayout] Active branch changed dynamically:', branch?.name || 'Sede Central');
      this.updateBranchMenu(branch, lang);
      this.updateBranding(branch);
    });
  }

  async ngOnInit() {
    // Escuchar cambios en el estado de autenticación (perfil, usuario)
    this.navigationSubscription.add(
      this.authService.authState$.subscribe(async (state) => {
        this.userProfile.set(state.profile);

        // Load branches if SuperAdmin, Tenant Owner, or Admin
        const role = state.profile?.role;
        if (this.authService.isSuperAdmin() || role === 'tenant_owner') {
          await this.loadAllBranches();
        }
      }),
    );

    // Inicializar notificaciones
    this.notificationService.loadNotifications();
    this.notificationService.subscribeToRealtime();

    // 2. Escuchar la sucursal asignada del perfil para inicializar el contexto correcto en el primer arranque
    this.navigationSubscription.add(
      this.authService.currentBranch$.subscribe(
        (assignedBranch: Branch | null) => {
          this.currentAssignedBranch.set(assignedBranch);
          if (assignedBranch) {
            // Ensure the assigned branch is in the dropdown options even if loadAllBranches wasn't called or missed it
            if (!this.branches().find((b) => b.id === assignedBranch.id)) {
              this.branches.update((list) => [...list, assignedBranch]);
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
        },
      ),
    );

    this.navigationSubscription.add(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event: any) => {
          this.preferencesService.closeSidebar();

          // Cierra el drawer de daisyUI en mobile al navegar
          const drawerCheckbox = document.getElementById(
            'admin-drawer',
          ) as HTMLInputElement;
          if (drawerCheckbox && drawerCheckbox.checked) {
            drawerCheckbox.checked = false;
          }

          const urlString = event.urlAfterRedirects || event.url;
          // Split and filter out empty segments to handle leading slashes cleanly
          const urlSegments = urlString.split('/').filter((s: string) => s);

          // Sede Central detect: first path segment is 'admin' (e.g., /admin/dashboard)
          const isSedeCentralUrl =
            urlSegments.length > 0 && urlSegments[0] === 'admin';

          if (isSedeCentralUrl) {
            if (this.branchService.getCurrentBranchId() !== null) {
              // console.log('[AdminLayout NavigationEnd] Sede Central detected. Resetting active branch to Central (null)');
              this.branchService.setCurrentBranch(null);
              this.updateBranding(null);
            }
          }
        }),
    );
  }

  updateBranchMenu(branch: Branch | null, lang: 'es' | 'en') {
    this.navigationItems = this.menuBuilder.buildMenuForBranch(
      branch,
      lang,
      this.navigationItems,
    );
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
    return !!(
      branch?.slug?.toLowerCase()?.includes('zaona') ||
      branch?.name?.toLowerCase()?.includes('zaona')
    );
  }

  async logout() {
    await this.authService.signOut();
    this.router.navigate(['/login']);
  }

  toggleNotif(event?: MouseEvent) {
    if (event) event.stopPropagation();
    this.isNotifOpen.update((v) => !v);
  }

  closeNotif() {
    this.isNotifOpen.set(false);
  }

  async handleNotificationClick(notif: any) {
    this.closeNotif();
    await this.notificationService.markAsRead(notif.id);
    if (notif.payload?.route) {
      this.router.navigate([notif.payload.route]);
    } else if (
      notif.type === 'message' ||
      notif.type === 'chat' ||
      notif.title?.toLowerCase().includes('mensaje') ||
      notif.title?.toLowerCase().includes('message')
    ) {
      this.router.navigate(['/admin/messages']);
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
    const branch = this.branches().find((b) => b.id === branchId);
    if (branch) {
      this.branchService.setCurrentBranch(branch);
      this.updateBranding(branch);
      this.router.navigate([`/${branch.slug}/admin`]);
    }
  }

  onParentClick(item: MenuItem) {
    if (!this.isMainMenuOpen()) {
      this.isMainMenuOpen.set(true);
      item.expanded = true;
    } else {
      item.expanded = !item.expanded;
    }

    if (item.path) {
      this.router.navigate([item.path]);
    }
    this.cdr.markForCheck();
  }

  private updateBranding(branch: Branch | null) {
    if (!branch) {
      const tenant = this.tenantService.getCurrentTenant();
      const tenantName = tenant
        ? tenant.name.toUpperCase()
        : 'ARECOFIX CENTRAL';
      this.branchBranding.set({
        logo: '/assets/img/brands/logo/logo-normal.PNG',
        name: tenantName,
      });
      if (typeof document !== 'undefined') {
        document.documentElement.style.removeProperty('--primary-branch-color');
      }
      return;
    }

    const branding = branch.branding_settings as any;
    this.branchBranding.set({
      logo: branding?.logo_url || '/assets/img/brands/logo/logo-normal.PNG',
      name: branch.name,
    });

    if (branding?.primary_color) {
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty(
          '--primary-branch-color',
          branding.primary_color,
        );
      }
    } else {
      if (typeof document !== 'undefined') {
        document.documentElement.style.removeProperty('--primary-branch-color');
      }
    }
  }

  toggleSidebar() {
    this.preferencesService.toggleSidebar();
  }

  toggleMainMenu() {
    this.isMainMenuOpen.update((v) => !v);
  }

  toggleCurrentFavorite() {
    const url = this.router.url;
    let title = 'Favorito';

    // Find current route title
    let currentRoute = this.router.routerState.root;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }
    title =
      currentRoute.snapshot.data['title'] ||
      currentRoute.snapshot.routeConfig?.title ||
      'Favorito';

    this.favoritesService.toggleFavorite({ url, title });
  }

  isCurrentFavorite(): boolean {
    return this.favoritesService.isFavorite(this.router.url);
  }
}
