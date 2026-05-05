import { ChangeDetectionStrategy, Component, input, inject, output, computed } from '@angular/core';
import { DecimalPipe, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../interfaces';
import { CartService } from '@app/shared/services/cart.service';
import { FavoritesService } from '@app/shared/services/favorites.service';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'product-card',
  standalone: true,
  imports: [RouterModule, DecimalPipe, NgOptimizedImage],
  templateUrl: './product-card.html',
  styles: `
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCard {
  product = input.required<Product>();
  isPriority = input(false);
  quickView = output<Product>();
  private cartService = inject(CartService);
  private favoritesService = inject(FavoritesService);
  private authService = inject(AuthService);

  isFavorite = computed(() => this.favoritesService.isFavorite(this.product().id));

  isWholesaleAuthorized = computed(() => {
    const profile = this.authService.getCurrentProfile();
    if (!profile) return false;
    const allowed = ['gremio', 'tecnico', 'admin', 'super_admin'];
    const r = profile.role?.toLowerCase() || '';
    return allowed.includes(r);
  });

  isRepuesto = computed(() => {
      const lower = this.product().name.toLowerCase();
      // Includes common categories and keywords for spare parts
      return lower.includes('repuesto') || lower.includes('módulo') || lower.includes('modulo') || 
             lower.includes('pantalla') || lower.includes('batería') || lower.includes('bateria') ||
             lower.includes('cámara') || lower.includes('camara') || lower.includes('pin de carga') ||
             lower.includes('flex') || lower.includes('tapa');
  });

  canViewPriceAndBuy = computed(() => {
      if (this.isRepuesto()) {
          return this.isWholesaleAuthorized();
      }
      return true; // if not a repuesto, anyone can see and buy
  });

  toggleFav(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.favoritesService.toggleFavorite(this.product());
  }

  addToCart(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.addToCart(this.product());
  }
}
