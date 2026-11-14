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
  untracked,
  ElementRef,
  viewChild,
} from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '@env/environment';
import { AuthService } from '@app/core/services/auth.service';
import { CartService } from '@app/shared/services/cart.service';
import { ThemeService } from '@app/core/services/theme.service';
import { SearchService } from '@app/shared/services/search.service';
import { AutoFocusDirective } from '@app/shared/directives/auto-focus.directive';
import { Product } from '@app/features/products/domain/entities/product.entity';
import { ProductRepository } from '@app/features/products/domain/repositories/product.repository';
import { CategoryRepository } from '@app/features/products/domain/repositories/category.repository';
import { CoursesService, Course } from '@app/core/services/courses.service';
import { NavItem } from '@app/shared/models/navigation.model';
import { NAVIGATION_ITEMS, THEME_STYLES, VIEW_ALL_LABELS } from '@app/shared/models/navigation.data';
import { NavItemRecursiveComponent } from '@app/shared/components/nav-item-recursive/nav-item-recursive.component';
import { ThemeToggleComponent } from '@app/shared/components/theme-toggle/theme-toggle.component';

import { map, switchMap, catchError, filter } from 'rxjs/operators';
import { Subscription, of } from 'rxjs';

import { NavigationStateService } from '@app/core/services/navigation-state.service';
import { HasPermissionDirective } from '@app/shared/directives/has-permission.directive';
import { FormatPricePipe } from '@app/shared/pipes/format-price.pipe';

// ── Constants ──────────────────────────────────────────────
const IDLE_CALLBACK_TIMEOUT_MS = 4000;
const IDLE_FALLBACK_MS = 2000;
const MEGA_MENU_CLOSE_DELAY_MS = 200;
const SCROLL_HIDE_THRESHOLD_PX = 50;
const SCROLL_DELTA_THRESHOLD_PX = 10;
const IOS_ZOOM_RESET_DELAY_MS = 150;
const IOS_ZOOM_RESET_RESTORE_MS = 300;
const DEFAULT_VIEWPORT_CONTENT = 'width=device-width, initial-scale=1.0, viewport-fit=cover';

@Component({
  selector: 'public-layout-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    FormsModule,
    NavItemRecursiveComponent,
    ThemeToggleComponent,
    AutoFocusDirective,
    NgOptimizedImage,
    HasPermissionDirective,
    FormatPricePipe,
  ],
  templateUrl: './public-layout-header.html',
  styles: `:host { display: block; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLayoutHeader implements OnInit, OnDestroy {
  // ── Inyecciones ──────────────────────────────────────────
  public readonly appName = environment.appName;
  public readonly authService = inject(AuthService);
  public readonly cartService = inject(CartService);
  public readonly themeService = inject(ThemeService);
  public readonly searchService = inject(SearchService);
  public readonly navState = inject(NavigationStateService);

  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly productRepo = inject(ProductRepository);
  private readonly categoryRepo = inject(CategoryRepository);
  private readonly coursesService = inject(CoursesService);

  /** Cached at construction — safe because PLATFORM_ID never changes for a given execution. */
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // ── Element refs para manejo de click-outside ────────────
  private readonly desktopSearchWrapper = viewChild<ElementRef<HTMLElement>>('desktopSearchWrapper');
  private readonly mobileSearchWrapper = viewChild<ElementRef<HTMLElement>>('mobileSearchWrapper');

  // ── Auth state ───────────────────────────────────────────
  public readonly user = toSignal(
    this.authService.authState$.pipe(map((state) => state.profile || state.user)),
    { initialValue: null },
  );

  // ── URL actual (signal) ──────────────────────────────────
  public readonly currentUrl = signal<string>(this.router.url);

  // ── Derived URL state (computed — cachea hasta que cambie currentUrl) ──
  public readonly isAcademyMode = computed(() => this.currentUrl().includes('/academy'));

  public readonly isCelularLandingMode = computed(() => {
    const urlPath = this.currentUrl().split('?')[0];
    return urlPath === '/celular' || urlPath.startsWith('/celular/');
  });

  public readonly showCart = computed(() => {
    const url = this.currentUrl();
    return url !== '/' && !this.isCelularLandingMode() && !this.isAcademyMode();
  });

  public readonly searchPlaceholder = computed(() =>
    this.isAcademyMode() ? 'Buscar cursos...' : 'Buscar productos...',
  );

  // ── Search state ─────────────────────────────────────────
  public readonly searchQuery = signal('');
  public readonly products = signal<Product[]>([]);
  public readonly coursesResults = signal<Course[]>([]);
  public readonly showResults = signal(false);
  public readonly isSearching = signal(false);
  public readonly searchFocusRequested = signal(false);

  /** Alias de compatibilidad — mismo signal que products. */
  public readonly filteredProducts = this.products;

  // ── Navigation Data ──────────────────────────────────────
  public readonly navItems = signal<NavItem[]>(NAVIGATION_ITEMS);

  public readonly megaMenuItems = computed(() =>
    this.navItems().filter((item) => item.children && item.children.length > 0),
  );

  public readonly directLinks = computed(() =>
    this.navItems().filter((item) => !item.children || item.children.length === 0),
  );

  // ── Mobile drawer ────────────────────────────────────────
  public readonly isMobileMenuOpen = this.navState.isMobileMenuOpen;

  // ── Mega menu ────────────────────────────────────────────
  public readonly activeMegaMenu = signal<string | null>(null);
  private megaMenuTimeout: ReturnType<typeof setTimeout> | null = null;

  // ── Cart ─────────────────────────────────────────────────
  public readonly isCartOpen = this.cartService.isCartOpen;

  // ── Navbar visibility ────────────────────────────────────
  public readonly isVisible = signal(true);
  private lastScrollTop = 0;
  private scrollRafId: number | null = null;

  private readonly subscriptions = new Subscription();

  constructor() {
    // Al agregar al carrito, forzar navbar visible
    effect(() => {
      const items = this.cartService.cartItems();
      untracked(() => {
        if (items.length > 0) {
          this.showNavbar();
          this.lastScrollTop = this.isBrowser
            ? window.scrollY || document.documentElement.scrollTop
            : 0;
        }
      });
    });
  }

  // ── Lifecycle ────────────────────────────────────────────
  ngOnInit(): void {
    if (this.isBrowser) {
      this.scheduleIdleTask(() => {
        this.loadDynamicCategories();
      });
    }

    // Una sola suscripción a NavigationEnd: actualiza URL + resetea visibilidad
    this.subscriptions.add(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          this.currentUrl.set(this.router.url);
          this.showNavbar();
          this.lastScrollTop = this.isBrowser
            ? window.scrollY || document.documentElement.scrollTop
            : 0;
        }),
    );

    // Focus requests externos (desde otros componentes)
    this.subscriptions.add(
      this.searchService.focusRequested$.subscribe(() => {
        if (!this.isMobileMenuOpen()) {
          this.searchFocusRequested.set(true);
          this.navState.openMobileMenu();
        }
      }),
    );

    // Búsqueda debounced server-side
    this.subscriptions.add(
      this.searchService.debouncedQuery$
        .pipe(
          switchMap((term) => {
            this.searchQuery.set(term);
            this.showResults.set(!!term);

            if (!term || term.length <= 1) {
              this.products.set([]);
              this.coursesResults.set([]);
              this.isSearching.set(false);
              return of(null);
            }

            this.isSearching.set(true);

            if (this.isAcademyMode()) {
              return this.coursesService.getCourses().pipe(
                map((res) => {
                  const filtered = (res.data ?? []).filter((c) =>
                    c.title.toLowerCase().includes(term.toLowerCase()),
                  );
                  this.coursesResults.set(filtered.slice(0, 10));
                  this.isSearching.set(false);
                }),
                catchError((err) => {
                  console.error('Course search error:', err);
                  this.isSearching.set(false);
                  return of(null);
                }),
              );
            }

            return this.productRepo.search(term).pipe(
              map((results) => {
                this.products.set(results.slice(0, 10));
                this.isSearching.set(false);
              }),
              catchError((err) => {
                console.error('Product search error:', err);
                this.isSearching.set(false);
                return of(null);
              }),
            );
          }),
        )
        .subscribe(),
    );
  }

  ngOnDestroy(): void {
    if (this.megaMenuTimeout) clearTimeout(this.megaMenuTimeout);
    if (this.scrollRafId !== null && this.isBrowser) {
      cancelAnimationFrame(this.scrollRafId);
    }
    this.subscriptions.unsubscribe();
  }

  // ── Scroll (throttled con requestAnimationFrame) ─────────
  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (!this.isBrowser || this.scrollRafId !== null) return;

    this.scrollRafId = requestAnimationFrame(() => {
      this.scrollRafId = null;
      this.handleScroll();
    });
  }

  private handleScroll(): void {
    const currentScroll = window.scrollY || document.documentElement.scrollTop;

    if (currentScroll < SCROLL_HIDE_THRESHOLD_PX) {
      this.showNavbar();
      this.lastScrollTop = currentScroll;
      return;
    }

    const delta = currentScroll - this.lastScrollTop;
    if (delta > 0 && Math.abs(delta) > SCROLL_DELTA_THRESHOLD_PX) {
      this.hideNavbar();
      this.lastScrollTop = currentScroll;
    } else if (delta < 0) {
      this.showNavbar();
      this.lastScrollTop = currentScroll;
    }
  }

  // ── Click outside (search dropdown) ──────────────────────
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isBrowser || !this.showResults()) return;

    const target = event.target as HTMLElement;
    const desktop = this.desktopSearchWrapper()?.nativeElement;
    const mobile = this.mobileSearchWrapper()?.nativeElement;

    const clickedInsideDesktop = desktop?.contains(target) ?? false;
    const clickedInsideMobile = mobile?.contains(target) ?? false;

    if (!clickedInsideDesktop && !clickedInsideMobile) {
      this.showResults.set(false);
    }
  }

  // ── Visibility helpers ───────────────────────────────────
  private showNavbar(): void {
    if (!this.isVisible()) this.isVisible.set(true);
  }

  private hideNavbar(): void {
    if (this.isVisible()) this.isVisible.set(false);
  }

  // ── Idle task helper ─────────────────────────────────────
  private scheduleIdleTask(task: () => void): void {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => task(), { timeout: IDLE_CALLBACK_TIMEOUT_MS });
    } else {
      setTimeout(() => task(), IDLE_FALLBACK_MS);
    }
  }

  // ── Categories dinámicas ─────────────────────────────────
  private loadDynamicCategories(): void {
    this.categoryRepo.getAll({ column: 'name', ascending: true }).subscribe({
      next: (categories) => {
        if (!categories?.length) return;

        this.navItems.update((currentItems) => {
          const newItems = [...currentItems];
          const tienda = newItems.find((item) => item.id === 'tienda');
          const todasCategorias = tienda?.children?.find((child) => child.id === 'tienda-categorias');

          if (!todasCategorias) return newItems;

          todasCategorias.children = categories
            .filter((cat) => !!cat.slug)
            .map((cat) => ({
              id: `dynamic-cat-${cat.id}`,
              label: cat.name,
              path: `/productos/categoria/${encodeURIComponent(cat.slug)}`,
              icon: 'fas fa-tag',
              theme: 'tienda',
            }));

          return newItems;
        });
      },
      error: (err) => {
        // RLS policy o auth pendiente — no es fatal
        console.warn(
          '[PublicLayoutHeader] Dynamic categories deferred (RLS/auth):',
          err?.message ?? err,
        );
      },
    });
  }

  // ── Mobile menu ──────────────────────────────────────────
  toggleMobileMenu(): void {
    this.navState.toggleMobileMenu();
    if (!this.navState.isMobileMenuOpen()) {
      this.searchFocusRequested.set(false);
    }
  }

  closeMobileMenu(): void {
    this.navState.closeMobileMenu();
    this.searchFocusRequested.set(false);
  }

  openMobileSearch(): void {
    this.searchFocusRequested.set(true);
    this.navState.openMobileMenu();
    this.searchService.requestSearchFocus();
  }

  onMobileNavClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (target.closest('a[routerLink], a[ng-reflect-router-link]')) {
      this.closeMobileMenu();
    }
  }

  // ── Mega menu ────────────────────────────────────────────
  openMegaMenu(id: string): void {
    if (this.megaMenuTimeout) clearTimeout(this.megaMenuTimeout);
    this.activeMegaMenu.set(id);
  }

  closeMegaMenuDelayed(): void {
    this.megaMenuTimeout = setTimeout(
      () => this.activeMegaMenu.set(null),
      MEGA_MENU_CLOSE_DELAY_MS,
    );
  }

  keepMegaMenuOpen(): void {
    if (this.megaMenuTimeout) clearTimeout(this.megaMenuTimeout);
  }

  // ── Cart ─────────────────────────────────────────────────
  toggleCart(): void {
    this.cartService.toggleCart();
  }

  // ── Search ───────────────────────────────────────────────
  onSearchInput(): void {
    const value = this.searchQuery();
    this.searchService.updateQuery(value);
    this.showResults.set(value.length > 0);
  }

  onSearchFocus(): void {
    if (this.searchQuery().length > 1) this.showResults.set(true);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.showResults.set(false);
    this.searchService.updateQuery('');
  }

  goToSearch(): void {
    const query = this.searchQuery().trim();
    if (!query) return;

    this.showResults.set(false);
    this.closeMobileMenu();

    if (this.isAcademyMode()) {
      this.router.navigate(['/academy'], { queryParams: { q: query } });
    } else {
      this.router.navigate(['/productos'], { queryParams: { q: query, _page: 1 } });
    }
  }

  /**
   * iOS Safari no resetea el zoom al blur del input.
   * Toggleamos el viewport temporalmente para forzar el reset.
   */
  onSearchBlur(): void {
    if (!this.isBrowser) return;
    if (!window.matchMedia('(max-width: 768px)').matches) return;

    setTimeout(() => {
      const meta = document.querySelector('meta[name="viewport"]');
      if (!meta) return;

      const original = meta.getAttribute('content');
      meta.setAttribute(
        'content',
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0',
      );

      setTimeout(
        () => meta.setAttribute('content', original || DEFAULT_VIEWPORT_CONTENT),
        IOS_ZOOM_RESET_RESTORE_MS,
      );
    }, IOS_ZOOM_RESET_DELAY_MS);
  }

  selectProduct(product: Product): void {
    this.clearSearch();
    this.closeMobileMenu();
    this.router.navigate(['/productos/detalle', product.slug || product.id]);
  }

  selectCourse(course: Course): void {
    this.clearSearch();
    this.closeMobileMenu();
    this.router.navigate(['/academy', course.slug || course.id]);
  }

  // ── Auth ─────────────────────────────────────────────────
  async logout(): Promise<void> {
    try {
      await this.authService.signOut();
      this.goToRoute('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  }

  // ── Navigation helper ────────────────────────────────────
  goToRoute(route: string): void {
    if (this.isBrowser && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    this.closeMobileMenu();
    this.router.navigate([route]);
  }

  // ── Theme helpers ────────────────────────────────────────
  getThemeStyles(theme: string) {
    return THEME_STYLES[theme] ?? THEME_STYLES['general'];
  }

  getMegaFooterLabel(itemId: string): string {
    return VIEW_ALL_LABELS[itemId] ?? 'Ver más';
  }
}