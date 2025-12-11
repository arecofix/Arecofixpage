import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product } from '@app/features/products/domain/entities/product.entity';
import { AdminProductService } from './services/admin-product.service';

@Component({
  selector: 'app-admin-products-page',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './admin-products-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProductsPage implements OnInit {
  private productService = inject(AdminProductService);
  public cdr = inject(ChangeDetectorRef);
  
  // Signals
  public products = signal<Product[]>([]);
  public searchQuery = signal<string>('');
  public sortOrder = signal<'name_asc' | 'price_asc' | 'price_desc' | 'stock_asc' | 'stock_desc'>('name_asc');
  
  public loading = signal<boolean>(true);
  public error = signal<string | null>(null);

  // Computed Filtered & Sorted Products
  public filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase();
    let result = this.products();

    // 1. Filter
    if (query) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.slug?.toLowerCase().includes(query) ||
        p.sku?.toLowerCase().includes(query) ||
        p.barcode?.toLowerCase().includes(query)
      );
    }

    // 2. Sort
    const sort = this.sortOrder();
    return result.sort((a, b) => {
      switch (sort) {
        case 'price_asc': return a.price - b.price;
        case 'price_desc': return b.price - a.price;
        case 'stock_asc': return a.stock - b.stock;
        case 'stock_desc': return b.stock - a.stock;
        case 'name_asc': default: return a.name.localeCompare(b.name);
      }
    });
  });

  async ngOnInit() {
    try {
      const data = await this.productService.getProducts();
      this.products.set(data);
    } catch (e: any) {
      this.error.set(e.message || 'Error al cargar productos');
    } finally {
      this.loading.set(false);
    }
  }

  async exportProducts() {
    try {
      this.loading.set(true);
      await this.productService.exportProductsToCSV();
    } catch (e: any) {
      this.error.set(e.message || 'Error al exportar productos');
    } finally {
      this.loading.set(false);
    }
  }

  async importProducts(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      this.loading.set(true);
      const result = await this.productService.importProductsFromCSV(file);
      alert(`Importación completada: ${result.success} productos importados/actualizados. ${result.errors} errores.`);
      // Reload products
      const data = await this.productService.getProducts();
      this.products.set(data);
    } catch (e: any) {
      this.error.set(e.message || 'Error al importar productos');
    } finally {
      this.loading.set(false);
      // Reset file input
      event.target.value = '';
    }
  }

  // Helpers for Template
  updateSort(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.sortOrder.set(value as any);
  }
}