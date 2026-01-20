import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface ProductCarouselItem {
  image: string;
  name: string;
  description: string;
  link: string;
}

@Component({
  selector: 'app-product-carousel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-carousel.component.html'
})
export class ProductCarouselComponent {
  @Input() title: string = '';
  @Input() items: ProductCarouselItem[] = [];
  @Input() addToCartText: string = 'Agregar al carrito';
}
