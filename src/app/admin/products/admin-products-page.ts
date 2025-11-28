import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@app/features/products/domain/entities/product.entity';
import { AdminProductService } from './services/admin-product.service';

@Component({
  selector: 'app-admin-products-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-products-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProductsPage implements OnInit {
  private productService = inject(AdminProductService);
  private cdr = inject(ChangeDetectorRef);
  products: Product[] = [];
  loading = true;
  error: string | null = null;

  async ngOnInit() {
    try {
      this.products = await this.productService.getProducts();
    } catch (e: any) {
      this.error = e.message || 'Error al cargar productos';
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }
}