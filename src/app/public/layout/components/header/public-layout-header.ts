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
import { ProductRepository } from '@app/features/products/domain/repositories/product.repository';
import { CategoryRepository } from '@app/features/products/domain/repositories/category.repository';
import { Category } from '@app/features/products/domain/entities/category.entity';
import { NavItem } from '@app/shared/models/navigation.model';
import { NAVIGATION_ITEMS, THEME_STYLES, VIEW_ALL_LABELS } from '@app/shared/models/navigation.data';
import { NavItemRecursiveComponent } from '@app/shared/components/nav-item-recursive/nav-item-recursive.component';
import { ThemeToggleComponent } from '@app/shared/components/theme-toggle/theme-toggle.component';
import { SearchUtils } from '@app/shared/utils/search.utils';
import { map } from 'rxjs/operators';
import { Subscription, firstValueFrom } from 'rxjs';

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
  private productRepo = inject(ProductRepository);
  private categoryRepo = inject(CategoryRepository);

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

  // ── Search Logic (OPTIMIZED: Server-side search) ──────────────────
  public searchQuery = signal('');
  public products = signal<Product[]>([]);
  public showResults = signal(false);
  public isSearching = signal(false);

  /**
   * We no longer pre-load all products. Instead, we react to optimized search terms
   * and query the database directly for the best matches.
   */
  public filteredProducts = this.products;

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
        (window as any).requestIdleCallback(() => {
          this.loadProducts();
          this.loadDynamicCategories();
        }, { timeout: 4000 });
      } else {
        setTimeout(() => {
          this.loadProducts();
          this.loadDynamicCategories();
        }, 2000);
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

    // Debounced search — fetch results from the server on demand
    this.subscriptions.add(
      this.searchService.debouncedQuery$.subscribe(async (term) => {
        this.searchQuery.set(term);
        this.showResults.set(!!term);
        
        if (term && term.length > 1) {
          this.isSearching.set(true);
          try {
            const results = await firstValueFrom(this.productRepo.search(term));
            this.products.set(results.slice(0, 10)); // Take top results
          } catch (err) {
            console.error('Search error:', err);
          } finally {
            this.isSearching.set(false);
          }
        } else {
          this.products.set([]);
        }
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

  /**
   * DEPRECATED: We no longer load all products into memory.
   * Search is now triggered on-demand via searchService.debouncedQuery$.
   */
  /**
   * Fetches active categories from the database and injects them 
   * into the 'Tienda' -> 'Todas las Categorías' navigation item.
   */
  async loadDynamicCategories() {
    try {
      this.categoryRepo.getAll({ column: 'name', ascending: true }).subscribe({
        next: (categories) => {
          if (!categories || categories.length === 0) return;

          this.navItems.update(currentItems => {
            // Clone high-level structure to avoid mutation issues
            const newItems = [...currentItems];
            const tienda = newItems.find(item => item.id === 'tienda');
            
            if (tienda && tienda.children) {
              const todasCategorias = tienda.children.find(child => child.id === 'tienda-categorias');
              
              if (todasCategorias) {
                // Convert DB categories to NavItems
                todasCategorias.children = categories.map(cat => ({
                  id: `dynamic-cat-${cat.id}`,
                  label: cat.name,
                  path: `/productos/categoria/${cat.slug}`,
                  icon: 'fas fa-tag', // Default icon for dynamic categories
                  theme: 'tienda'
                }));
                
                this.cdr.markForCheck();
              }
            }
            return newItems;
          });
        },
        error: (err) => {
          // Gracefully log developer warning and mark CD
          console.warn('[PublicLayoutHeader] Dynamic categories loading deferred (database read RLS policy restricted/auth dependent).', err);
          this.cdr.markForCheck();
        }
      });
    } catch (err) {
      console.error('Error loading dynamic categories:', err);
    }
  }

  async loadProducts() {
    // No-op - loading on demand now
  }

  public onSearchInput(): void {
    this.searchService.updateQuery(this.searchQuery());
    this.showResults.set(!!this.searchQuery());
  }

  public goToSearch(): void {
    const query = this.searchQuery().trim();
    if (query) {
      this.showResults.set(false);
      this.closeMobileMenu();
      this.router.navigate(['/productos'], { queryParams: { q: query, _page: 1 } });
    }
  }

  /**
   * FIX: iOS Safari doesn't automatically "un-zoom" when an input is blurred.
   * This trick temporarily toggles the viewport scale to force a reset.
   */
  public onSearchBlur(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Check if it's likely a mobile device (touch support + small width)
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) return;

    // We use a small timeout to allow any pending clicks (like selecting a product) to finish
    setTimeout(() => {
      const meta = document.querySelector('meta[name="viewport"]');
      if (meta) {
        const originalContent = meta.getAttribute('content');
        // Force a specific scale briefly to reset any browser zoom
        meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');

        // Restore to original after a tiny delay
        setTimeout(() => {
          meta.setAttribute('content', originalContent || 'width=device-width, initial-scale=1.0, viewport-fit=cover');
        }, 300);
      }
    }, 150);
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
