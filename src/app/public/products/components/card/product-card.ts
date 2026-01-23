import { ChangeDetectionStrategy, Component, input, inject, output, computed } from '@angular/core';
import { DecimalPipe, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../interfaces';
import { CartService } from '@app/shared/services/cart.service';
import { FavoritesService } from '@app/shared/services/favorites.service';

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

  isFavorite = computed(() => this.favoritesService.isFavorite(this.product().id));

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
