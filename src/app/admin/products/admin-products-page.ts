import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product } from '@app/features/products/domain/entities/product.entity';
import { AdminProductService } from './services/admin-product.service';
import { Pagination } from '@app/shared/components/pagination/pagination';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-products-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, Pagination],
  templateUrl: './admin-products-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProductsPage implements OnInit {
  private productService = inject(AdminProductService);
  public cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  
  // Signals
  public products = signal<Product[]>([]);
  public searchQuery = signal<string>('');
  public sortOrder = signal<'name_asc' | 'price_asc' | 'price_desc' | 'stock_asc' | 'stock_desc'>('name_asc');
  
  // Pagination Signals
  public currentPage = signal<number>(1);
  public itemsPerPage = signal<number>(10);
  
  public loading = signal<boolean>(true);
  public error = signal<string | null>(null);

  // Computed: Filtered & Sorted (Full List)
  public allFilteredProducts = computed(() => {
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

  // Computed: Paginated Slice
  public paginatedProducts = computed(() => {
    const all = this.allFilteredProducts();
    const page = this.currentPage();
    const perPage = this.itemsPerPage();
    
    const start = (page - 1) * perPage;
    return all.slice(start, start + perPage);
  });

  // Computed: Total Pages
  public totalPages = computed(() => {
     return Math.ceil(this.allFilteredProducts().length / this.itemsPerPage());
  });

  async ngOnInit() {
    // Sync URL params
    this.route.queryParams.subscribe(params => {
      const page = params['_page'] ? Number(params['_page']) : 1;
      this.currentPage.set(page || 1);
    });

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