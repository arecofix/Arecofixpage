import {
  Component,
  ChangeDetectionStrategy,
  inject,
  ChangeDetectorRef,
  signal,
  computed,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  HostListener,
  effect,
} from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '@env/environment';
import { AuthService } from '@app/core/services/auth.service';
import { CartService } from '@app/shared/services/cart.service';
import { ThemeService } from '@app/core/services/theme.service';
import { SearchService } from '@app/shared/services/search.service';
import { AutoFocusDirective } from '@app/shared/directives/auto-focus.directive';
import { Product } from '@app/features/products/domain/entities/product.entity';
import { NavItem } from '@app/shared/models/navigation.model';
import { NAVIGATION_ITEMS, THEME_STYLES, VIEW_ALL_LABELS } from '@app/shared/models/navigation.data';
import { NavItemRecursiveComponent } from '@app/shared/components/nav-item-recursive/nav-item-recursive.component';
import { ThemeToggleComponent } from '@app/shared/components/theme-toggle/theme-toggle.component';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'public-layout-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    FormsModule,
    NavItemRecursiveComponent,
    ThemeToggleComponent,
    AutoFocusDirective,
    NgOptimizedImage,
  ],
  templateUrl: './public-layout-header.html',
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLayoutHeader implements OnInit, OnDestroy {
  // ── Dependencies ──────────────────────────────────
  public appName: string = environment.appName;
  public authService = inject(AuthService);
  public cartService = inject(CartService);
  public themeService = inject(ThemeService);
  public searchService = inject(SearchService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  public user$ = this.authService.authState$.pipe(map((state) => state.user));

  /** Flag: the drawer was opened specifically for search (triggers immediate focus). */
  public searchFocusRequested = signal(false);

  private subscriptions = new Subscription();

  // ── Navigation Data ───────────────────────────────
  /**
   * Static navigation items from the centralized data file.
   * The menu is fully data-driven: add items to navigation.data.ts
   * and they automatically appear in both desktop and mobile menus.
   */
  readonly navItems = signal<NavItem[]>(NAVIGATION_ITEMS);

  /** Top-level items that have children → rendered as mega-menus or dropdowns */
  readonly megaMenuItems = computed(() =>
    this.navItems().filter((item) => item.children && item.children.length > 0)
  );

  /** Top-level items without children → rendered as simple links */
  readonly directLinks = computed(() =>
    this.navItems().filter((item) => !item.children || item.children.length === 0)
  );

  // ── Search Logic ──────────────────────────────────
  public searchQuery = signal('');
  public products = signal<Product[]>([]);
  public showResults = signal(false);

  public filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return [];
    return this.products()
      .filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.sku?.toLowerCase().includes(query) ||
          p.barcode?.toLowerCase().includes(query)
      )
      .slice(0, 10);
  });

  // ── Mobile Menu ───────────────────────────────────
  public isMobileMenuOpen = signal(false);

  toggleMobileMenu() {
    this.isMobileMenuOpen.update((v) => !v);
    if (!this.isMobileMenuOpen()) {
      this.searchFocusRequested.set(false);
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
    this.searchFocusRequested.set(false);
  }

  /**
   * Opens the mobile drawer and requests focus on the search input.
   * Triggered by the navbar lupa icon.
   */
  openMobileSearch(): void {
    this.searchFocusRequested.set(true);
    this.isMobileMenuOpen.set(true);
    this.searchService.requestSearchFocus();
  }

  /** Close mobile drawer when a nav link (not accordion toggle) is clicked */
  onMobileNavClick(event: Event) {
    const target = event.target as HTMLElement;
    const anchor = target.closest('a[routerLink], a[ng-reflect-router-link]');
    if (anchor) {
      this.closeMobileMenu();
    }
  }

  // ── Desktop Mega Menu ─────────────────────────────
  public activeMegaMenu = signal<string | null>(null);
  private megaMenuTimeout: ReturnType<typeof setTimeout> | null = null;

  openMegaMenu(id: string) {
    if (this.megaMenuTimeout) clearTimeout(this.megaMenuTimeout);
    this.activeMegaMenu.set(id);
  }

  closeMegaMenuDelayed() {
    this.megaMenuTimeout = setTimeout(() => {
      this.activeMegaMenu.set(null);
    }, 200);
  }

  keepMegaMenuOpen() {
    if (this.megaMenuTimeout) clearTimeout(this.megaMenuTimeout);
  }

  // ── Cart ──────────────────────────────────────────
  public isCartOpen = this.cartService.isCartOpen;
  public toggleCart() {
    this.cartService.toggleCart();
  }

  // ── Navbar Visibility (auto-hide on scroll) ───────
  public isVisible = signal(true);
  private lastScrollTop = 0;

  constructor() {
    // Defer product loading — not needed until user interacts with search
    // Show navbar when item added to cart
    effect(() => {
      const items = this.cartService.cartItems();
      if (items.length > 0) {
        this.showNavbar();
        this.lastScrollTop = isPlatformBrowser(this.platformId)
          ? window.scrollY || document.documentElement.scrollTop
          : 0;
      }
    });
  }

  ngOnInit(): void {
    // Defer product loading to idle time — not needed until search
    if (isPlatformBrowser(this.platformId)) {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => this.loadProducts(), { timeout: 4000 });
      } else {
        setTimeout(() => this.loadProducts(), 2000);
      }
    }

    // Listen for external search-focus requests (e.g. from other components)
    this.subscriptions.add(
      this.searchService.focusRequested$.subscribe(() => {
        if (!this.isMobileMenuOpen()) {
          this.searchFocusRequested.set(true);
          this.isMobileMenuOpen.set(true);
          this.cdr.markForCheck();
        }
      })
    );

    // Debounced search — react to optimized query changes
    this.subscriptions.add(
      this.searchService.debouncedQuery$.subscribe((term) => {
        this.searchQuery.set(term);
        this.showResults.set(!!term);
        this.cdr.markForCheck();
      })
    );
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    if (!isPlatformBrowser(this.platformId)) return;

    const currentScroll = window.scrollY || document.documentElement.scrollTop;

    if (currentScroll < 50) {
      this.showNavbar();
      this.lastScrollTop = currentScroll;
      return;
    }

    const scrollDelta = currentScroll - this.lastScrollTop;
    if (scrollDelta > 0 && Math.abs(scrollDelta) > 10) {
      this.hideNavbar();
      this.lastScrollTop = currentScroll;
    } else if (scrollDelta < 0) {
      this.showNavbar();
      this.lastScrollTop = currentScroll;
    }
  }

  private showNavbar() {
    if (!this.isVisible()) {
      this.isVisible.set(true);
      this.cdr.markForCheck();
    }
  }

  private hideNavbar() {
    if (this.isVisible()) {
      this.isVisible.set(false);
      this.cdr.markForCheck();
    }
  }

  ngOnDestroy() {
    if (this.megaMenuTimeout) clearTimeout(this.megaMenuTimeout);
    this.subscriptions.unsubscribe();
  }

  // ── Search ────────────────────────────────────────
  async loadProducts() {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const supabase = this.authService.getSupabaseClient();
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .gt('stock', 0)
        .order('name');
      if (data) this.products.set(data);
    } catch {
      // Silent fail on SSR or no supabase
    }
  }

  public onSearchInput(): void {
    this.searchService.updateQuery(this.searchQuery());
    this.showResults.set(!!this.searchQuery());
  }

  public selectProduct(product: Product) {
    this.searchQuery.set('');
    this.showResults.set(false);
    this.closeMobileMenu();
    this.router.navigate(['/productos/detalle', product.slug || product.id]);
  }

  // ── Auth ──────────────────────────────────────────
  async logout() {
    try {
      await this.authService.signOut();
      this.cdr.markForCheck();
      this.router.navigate(['/login']);
    } catch (err) {
      console.error('Error during logout:', err);
    }
  }

  // ── Theme Helpers (for template) ──────────────────
  getThemeStyles(theme: string) {
    return THEME_STYLES[theme] ?? THEME_STYLES['general'];
  }

  /** Context-aware label for the mega menu footer link */
  getMegaFooterLabel(itemId: string): string {
    return VIEW_ALL_LABELS[itemId] ?? 'Ver más';
  }
}
