import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product } from '@app/features/products/domain/entities/product.entity';
import { Brand } from '@app/features/products/domain/entities/brand.entity';
import { AdminProductService } from './services/admin-product.service';
import { Pagination } from '@app/shared/components/pagination/pagination';
import { CommonModule } from '@angular/common';
import { BulkEditModalComponent } from './components/bulk-edit-modal/bulk-edit-modal.component';

@Component({
  selector: 'app-admin-products-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, Pagination, BulkEditModalComponent],
  templateUrl: './admin-products-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProductsPage implements OnInit {
  private productService = inject(AdminProductService);
  public cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  
  // Signals
  public products = signal<Product[]>([]);
  public brands = signal<Brand[]>([]); // For bulk edit
  public searchQuery = signal<string>('');
  public sortOrder = signal<'name_asc' | 'price_asc' | 'price_desc' | 'stock_asc' | 'stock_desc'>('name_asc');
  
  // Selection Helper
  public selectedIds = signal<Set<string>>(new Set());

  // Bulk Edit Modal State
  public isBulkModalOpen = signal(false);
  
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

  public isAllSelected = computed(() => {
      const pageItems = this.paginatedProducts();
      if (pageItems.length === 0) return false;
      const selected = this.selectedIds();
      return pageItems.every(p => selected.has(p.id));
  });

  public selectedIdsList = computed(() => Array.from(this.selectedIds()));

  async ngOnInit() {
    // Sync URL params
    this.route.queryParams.subscribe(params => {
      const page = params['_page'] ? Number(params['_page']) : 1;
      this.currentPage.set(page || 1);
    });

    try {
      const [products, brands] = await Promise.all([
          this.productService.getProducts(),
          this.productService.getBrands()
      ]);
      this.products.set(products);
      this.brands.set(brands);
    } catch (e: any) {
      this.error.set(e.message || 'Error al cargar productos');
    } finally {
      this.loading.set(false);
    }
  }

  // Selection Logic
  toggleSelection(id: string) {
    this.selectedIds.update(set => {
        const newSet = new Set(set);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        return newSet;
    });
  }

  toggleSelectAll() {
    const pageItems = this.paginatedProducts();
    const allSelected = this.isAllSelected();
    
    this.selectedIds.update(set => {
        const newSet = new Set(set);
        if (allSelected) {
            pageItems.forEach(p => newSet.delete(p.id));
        } else {
            pageItems.forEach(p => newSet.add(p.id));
        }
        return newSet;
    });
  }
  
  openBulkEdit() {
      if (this.selectedIds().size === 0) return;
      this.isBulkModalOpen.set(true);
  }

  onBulkEditSuccess() {
      this.selectedIds.set(new Set()); // Clear selection
      this.ngOnInit(); // Reload data
  }

  clearSelection() {
      this.selectedIds.set(new Set());
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

  async importProducts(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];

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
      input.value = '';
    }
  }

  // Helpers for Template
  updateSort(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.sortOrder.set(value as 'name_asc' | 'price_asc' | 'price_desc' | 'stock_asc' | 'stock_desc');
  }
}