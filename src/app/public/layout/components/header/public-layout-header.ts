import { Component, ChangeDetectionStrategy, inject, ChangeDetectorRef, signal, computed } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { environment } from '@env/environment';
import { CategoryService } from '@app/public/categories/services/category.service';
import { iCategoriesResponse, iCategory } from '@app/public/categories/interfaces';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthService } from '@app/services/auth.service';
import { CartService } from '@app/shared/services/cart.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { Product } from '@app/features/products/domain/entities/product.entity';

interface iMenuItem {
  title: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'public-layout-header',
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './public-layout-header.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLayoutHeader {
  public appName: string = environment.appName;
  public categoryService = inject(CategoryService);
  public authService = inject(AuthService);
  public cartService = inject(CartService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  public user$ = this.authService.authState$.pipe(map(state => state.user));

  // Search Logic
  public searchQuery = signal('');
  public products = signal<Product[]>([]);
  public showResults = signal(false);

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
    this.router.navigate(['/products/details', product.slug || product.id]);
  }

  public categoryRs = rxResource<iCategoriesResponse, unknown>({
    stream: () => this.categoryService.getFeaturedData(),
  });

  public menuItems = () => {
    const items = this.categoryRs.value()?.data
      .filter((category: iCategory) => category.slug !== 'sports' && category.name !== 'Deportes')
      .map((category: iCategory) => {
        let icon = category.icon;
        if (category.name === 'Celulares') icon = 'fas fa-mobile-alt';
        if (category.name === 'Repuestos') icon = 'fas fa-tools';
        if (category.name === 'Cursos') icon = 'fas fa-graduation-cap';

        return {
          title: category.name,
          path: '/products/category/' + category.slug,
          icon: icon || 'fas fa-box', // Fallback icon
        };
      }) ?? [];

    return items.sort((a, b) => {
      if (a.title === 'Celulares') return -1;
      if (b.title === 'Celulares') return 1;
      return 0;
    });
  };

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
