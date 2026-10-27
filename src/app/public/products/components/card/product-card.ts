import { ChangeDetectionStrategy, Component, input, inject, output, computed, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Product } from '../../interfaces';
import { CartService } from '@app/shared/services/cart.service';
import { FavoritesService } from '@app/shared/services/favorites.service';
import { AuthService } from '@app/core/services/auth.service';
import { ProductStrategicService } from '@app/core/services/product-strategic.service';
import { formatPrice } from '@app/shared/utils/price-formatter.util';

@Component({
  selector: 'product-card',
  standalone: true,
  imports: [RouterModule, NgOptimizedImage],
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
  private strategicService = inject(ProductStrategicService);
  private authService = inject(AuthService);
  router = inject(Router);

  hasImageError = signal(false);
  isFavorite = computed(() => this.favoritesService.isFavorite(this.product().id));

  // Strategic Computeds
  isLoggedIn = computed(() => !!this.authService.getCurrentProfile());
  isTechnicalCategory = computed(() => this.strategicService.isTechnicalCategory(this.product()));
  showPriceAndBuy = computed(() => this.strategicService.canViewPriceAndBuy(this.product()));
  showWishlist = computed(() => this.strategicService.canShowWishlist(this.product()));
  valueProposition = computed(() => this.strategicService.getValueProposition(this.product()));
  
  isInStock = computed(() => {
    const p = this.product();
    return (p.stock ?? 0) > 0;
  });

  // Base active price depending on technical category and authenticated status
  activePrice = computed(() => {
    const p = this.product();
    if (!this.isLoggedIn() && this.isTechnicalCategory() && p.retail_price) {
      return p.retail_price;
    }
    return p.price;
  });

  // Main formatted price (e.g. "U$D 425,00" or "AR$ 698.798")
  formattedMainPrice = computed(() => {
    const p = this.product();
    return formatPrice(this.activePrice(), p.currency || 'ARS');
  });

  // Secondary converted price (e.g. "⇄ AR$ 698.798" or "⇄ U$D 425,00")
  formattedSecondaryPrice = computed(() => {
    const p = this.product();
    if (p.currency === 'USD' && p.convertedPrice && p.price > 0) {
      const convertedValue = this.activePrice() * (p.convertedPrice / p.price);
      return formatPrice(convertedValue, 'ARS', { prefix: '⇄ ' });
    }
    if (p.currency === 'ARS' && p.convertedPrice && p.convertedPrice > 0) {
      return formatPrice(p.convertedPrice, 'USD', { prefix: '⇄ ' });
    }
    return null;
  });

  // Strikethrough comparison price for discounts or retail comparisons
  formattedStrikethroughPrice = computed(() => {
    const p = this.product();
    const currency = p.currency || 'ARS';

    if (this.isLoggedIn() && this.isTechnicalCategory() && p.retail_price && p.retail_price > p.price) {
      return formatPrice(p.retail_price, currency);
    }
    if (p.discount_percentage && p.discount_percentage > 0) {
      const original = p.price / (1 - (p.discount_percentage || 0) / 100);
      return formatPrice(original, currency);
    }
    return null;
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

  onImageError() {
    this.hasImageError.set(true);
  }
}
