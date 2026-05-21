import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '@app/public/products/interfaces';
import { ProductCard } from '../card/product-card';
import { IsErrorComponent } from '@app/shared/components/resource-status';
import { Pagination } from '@app/shared/components/pagination';

@Component({
  selector: 'app-products-grid',
  standalone: true,
  imports: [
    CommonModule,
    ProductCard,
    IsErrorComponent,
    Pagination
  ],
  templateUrl: './products-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsGridComponent {
  @Input({ required: true }) products: Product[] = [];
  @Input() isLoading = false;
  @Input() error: any = null;
  @Input() totalItems = 0;
  @Input() pages = 1;
  @Input() currentPage = 1;

  @Output() quickView = new EventEmitter<Product>();
  @Output() clearFilters = new EventEmitter<void>();

  onQuickView(product: Product): void {
    this.quickView.emit(product);
  }

  onClearFilters(): void {
    this.clearFilters.emit();
  }
}
