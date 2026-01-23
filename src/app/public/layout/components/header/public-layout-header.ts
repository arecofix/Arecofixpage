import { Component, ChangeDetectionStrategy, inject, ChangeDetectorRef, signal, computed, AfterViewInit, OnDestroy, PLATFORM_ID, ElementRef, Renderer2, HostListener, effect } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { environment } from '@env/environment';
import { CategoryService } from '@app/public/categories/services/category.service';
import { iCategoriesResponse, iCategory } from '@app/public/categories/interfaces';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthService } from '@app/core/services/auth.service';
import { CartService } from '@app/shared/services/cart.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Observable, fromEvent, Subject } from 'rxjs';
import { map, distinctUntilChanged, filter, pairwise, share, throttleTime, takeUntil } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { Product } from '@app/features/products/domain/entities/product.entity';

interface iMenuItem {
  id?: string;
  title: string;
  path: string;
  icon: string;
  parentId?: string;
  children?: iMenuItem[];
}

@Component({
  selector: 'public-layout-header',
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './public-layout-header.html',
  styles: `
    :host {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      transition: transform 0.3s ease-in-out;
      width: 100%;
      will-change: transform;
    }
    :host.hidden-navbar {
      transform: translateY(-100%) !important;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLayoutHeader implements AfterViewInit, OnDestroy {
  public appName: string = environment.appName;
  public categoryService = inject(CategoryService);
  public authService = inject(AuthService);
  public cartService = inject(CartService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  public user$ = this.authService.authState$.pipe(map(state => state.user));

  // Search Logic
  public searchQuery = signal('');
  public products = signal<Product[]>([]);
  public showResults = signal(false);
  
  // Cart Drawer Logic
  // Delegating to CartService for global state
  public isCartOpen = this.cartService.isCartOpen;

  public toggleCart() {
    this.cartService.toggleCart();
  }

  // Navbar Visibility Logic
  public isVisible = signal(true);
  private destroy$ = new Subject<void>();
  private lastScrollTop = 0;

  public filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return [];

    return this.products().filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.sku?.toLowerCase().includes(query) ||
      p.barcode?.toLowerCase().includes(query)
    ).slice(0, 10); // Limit to 10 results for UI
  });

  constructor() {
    this.loadProducts();

    effect(() => {
        // Track cart items dependency
        const items = this.cartService.cartItems();
        if (items.length > 0) {
             // Run this outside angular reactive context to avoid loops if needed, 
             // but here we just want to trigger a side effect (showing navbar)
             // We need to use untracked if we modified a signal that started this cycle, but showNavbar modifies a local signal isVisible.
             // However, to be safe and purely reactive side-effect:
             
             // Wrap in setTimeout to ensure it runs after view updates or simply just call it.
             // Since signals are synchronous, we just call it.
             this.showNavbar();
             this.lastScrollTop = isPlatformBrowser(this.platformId) ? (window.scrollY || document.documentElement.scrollTop) : 0;
        }
    });
  }



  ngAfterViewInit() {
    // No-op: Logic moved to HostListener for reliability
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    if (!isPlatformBrowser(this.platformId)) return;

    const currentScroll = window.scrollY || document.documentElement.scrollTop;

    // Safety check: always show if near top
    if (currentScroll < 50) {
      this.showNavbar();
      this.lastScrollTop = currentScroll;
      return;
    }

    const scrollDelta = currentScroll - this.lastScrollTop;

    if (scrollDelta > 0) {
      // Scrolling Down
      // Only hide if we've scrolled down a significant amount (e.g. > 10px) to avoid jitter
      if (Math.abs(scrollDelta) > 10) {
        this.hideNavbar();
        this.lastScrollTop = currentScroll;
      }
    } else {
      // Scrolling Up
      // Show immediately on ANY upward scroll
      this.showNavbar();
      this.lastScrollTop = currentScroll;
    }
  }

  private showNavbar() {
    if (!this.isVisible()) {
      this.isVisible.set(true);
      this.renderer.removeClass(this.el.nativeElement, 'hidden-navbar');
      this.cdr.markForCheck();
    }
  }

  private hideNavbar() {
    if (this.isVisible()) {
      this.isVisible.set(false);
      this.renderer.addClass(this.el.nativeElement, 'hidden-navbar');
      this.cdr.markForCheck();
    }
  }



  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async loadProducts() {
    const supabase = this.authService.getSupabaseClient();
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .gt('stock', 0)
      .order('name');

    if (data) {
      this.products.set(data);
    }
  }

  public onSearchInput() {
    this.showResults.set(!!this.searchQuery());
  }

  public selectProduct(product: Product) {
    this.searchQuery.set('');
    this.showResults.set(false);
    this.router.navigate(['/productos/detalle', product.slug || product.id]);
  }

  public categoryRs = rxResource<iCategoriesResponse, unknown>({
    stream: () => this.categoryService.getFeaturedData(),
  });

  public menuItems = computed(() => {
    const rawItems = this.categoryRs.value()?.data ?? [];
    
    // Filter out unwanted categories
    const filteredItems = rawItems.filter((category: iCategory) => 
      category.slug !== 'sports' && category.name !== 'Deportes'
    );

    // Map to menu items
    const allMenuItems: iMenuItem[] = filteredItems.map((category: iCategory) => {
      let icon = category.icon;
      if (category.name === 'Celulares') icon = 'fas fa-mobile-alt';
      if (category.name === 'Repuestos') icon = 'fas fa-tools';
      if (category.name === 'Cursos') icon = 'fas fa-graduation-cap';
      if (category.name === 'Herramientas') icon = 'fas fa-wrench';

      let slug = category.slug;
      if (slug === 'electrnicos') slug = 'electronicos';

      return {
        id: String(category.id), // Keep track of ID for nesting
        title: category.name,
        path: '/productos/categoria/' + slug.toLowerCase(),
        icon: icon || 'fas fa-box',
        parentId: category.parent_id ? String(category.parent_id) : undefined,
        children: []
      };
    });

    // CUSTOM LOGIC: Nest 'Herramientas' under 'Repuestos'
    const repuestosItem = allMenuItems.find(i => i.title === 'Repuestos');
    const herramientasItem = allMenuItems.find(i => i.title === 'Herramientas');

    if (repuestosItem && herramientasItem) {
      herramientasItem.parentId = repuestosItem.id;
    }

    // Build tree structure
    const rootItems: iMenuItem[] = [];
    const itemMap = new Map<string, iMenuItem>();

    // First pass: map items by ID
    allMenuItems.forEach(item => {
      if (item.id) itemMap.set(item.id, item);
    });

    // Second pass: link children to parents
    allMenuItems.forEach(item => {
      if (item.parentId && itemMap.has(item.parentId)) {
        const parent = itemMap.get(item.parentId)!;
        parent.children = parent.children || [];
        parent.children.push(item);
      } else {
        rootItems.push(item);
      }
    });

    // Sort root items
    return rootItems.sort((a, b) => {
      if (a.title === 'Celulares') return -1;
      if (b.title === 'Celulares') return 1;
      return 0;
    });
  });

  async logout() {
    try {
      await this.authService.signOut();
      this.cdr.markForCheck();
      this.router.navigate(['/login']);
    } catch (err) {
      console.error('Error during logout:', err);
    }
  }
}
