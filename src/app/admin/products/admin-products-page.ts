import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product } from '@app/features/products/domain/entities/product.entity';
import { Brand } from '@app/features/products/domain/entities/brand.entity';
import { AdminProductService, ImportReport } from './services/admin-product.service';
import { Pagination } from '@app/shared/components/pagination/pagination';
import { CommonModule } from '@angular/common';
import { BulkEditModalComponent } from './components/bulk-edit-modal/bulk-edit-modal.component';
import { ImportResultModalComponent } from './components/import-result-modal/import-result-modal.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-admin-products-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, Pagination, BulkEditModalComponent, ImportResultModalComponent],
  templateUrl: './admin-products-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProductsPage implements OnInit {
  private productService = inject(AdminProductService);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  
  // Signals
  public products = signal<Product[]>([]);
  public brands = signal<Brand[]>([]); 
  public categories = signal<any[]>([]);
  public searchQuery = signal<string>('');
  public sortOrder = signal<'name_asc' | 'price_asc' | 'price_desc' | 'stock_asc' | 'stock_desc'>('name_asc');
  
  // Selection
  public selectedIds = signal<Set<string>>(new Set());
  public isBulkModalOpen = signal(false);
  public bulkInitialTab = signal<'edit' | 'delete'>('edit');
  
  // Pagination
  public currentPage = signal<number>(1);
  public itemsPerPage = signal<number>(10);
  
  public loading = signal<boolean>(true);
  public importing = signal<boolean>(false);
  public importProgress = signal<string>('');
  public error = signal<string | null>(null);

  // Import result modal
  public importReport = signal<ImportReport | null>(null);
  public showImportResult = signal<boolean>(false);

  constructor() {
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe(params => {
      const page = params['_page'] ? Number(params['_page']) : 1;
      this.currentPage.set(page || 1);
    });
  }

  // Computed properties
  public allFilteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase();
    let result = [...this.products()];

    if (query) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.sku?.toLowerCase().includes(query)
      );
    }

    const sort = this.sortOrder();
    return result.sort((a, b) => {
      switch (sort) {
        case 'price_asc': return a.price - b.price;
        case 'price_desc': return b.price - a.price;
        case 'stock_asc': return (a.stock || 0) - (b.stock || 0);
        case 'stock_desc': return (b.stock || 0) - (a.stock || 0);
        default: return a.name.localeCompare(b.name);
      }
    });
  });

  public paginatedProducts = computed(() => {
    const all = this.allFilteredProducts();
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    return all.slice(start, start + this.itemsPerPage());
  });

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
    await this.loadData();
  }

  async loadData() {
    this.loading.set(true);
    try {
      const [products, brands, categories] = await Promise.all([
          this.productService.getProducts(),
          this.productService.getBrands(),
          this.productService.getCategories()
      ]);
      this.products.set(products);
      this.brands.set(brands);
      this.categories.set(categories);
    } catch (e: any) {
      this.error.set(e.message || 'Error al cargar datos');
    } finally {
      this.loading.set(false);
      this.cdr.detectChanges();
    }
  }

  toggleSelectAll() {
    const pageItems = this.paginatedProducts();
    const currentSelected = new Set(this.selectedIds());
    const allOnPageSelected = this.isAllSelected();

    if (allOnPageSelected) {
      pageItems.forEach(p => currentSelected.delete(p.id));
    } else {
      pageItems.forEach(p => currentSelected.add(p.id));
    }
    this.selectedIds.set(currentSelected);
  }

  toggleSelection(id: string) {
    const currentSelected = new Set(this.selectedIds());
    if (currentSelected.has(id)) {
      currentSelected.delete(id);
    } else {
      currentSelected.add(id);
    }
    this.selectedIds.set(currentSelected);
  }

  clearSelection() {
    this.selectedIds.set(new Set());
  }

  updateSort(event: any) {
    this.sortOrder.set(event.target.value);
  }

  openBulkEdit() {
    this.bulkInitialTab.set('edit');
    this.isBulkModalOpen.set(true);
  }

  openBulkDelete() {
    this.bulkInitialTab.set('delete');
    this.isBulkModalOpen.set(true);
  }

  async onBulkEditSuccess() {
    this.clearSelection();
    await this.loadData();
  }

  async exportProducts() {
    try {
      await this.productService.exportProductsToCSV();
    } catch (e: any) {
      this.error.set('Error al exportar: ' + e.message);
    }
  }

  async importProducts(event: any) {
    const file: File = event.target.files?.[0];
    // Reset file input so the same file can be re-selected if needed
    event.target.value = '';

    if (!file) return;

    try {
      this.importing.set(true);
      this.importProgress.set('Leyendo CSV y cargando inventario actual…');
      this.error.set(null);
      this.cdr.detectChanges();

      const report = await this.productService.importProductsFromCSV(file);

      this.importProgress.set('');
      this.importReport.set(report);
      this.showImportResult.set(true);
      this.cdr.detectChanges();
    } catch (e: any) {
      this.error.set('Error al importar: ' + e.message);
      this.importProgress.set('');
    } finally {
      this.importing.set(false);
      this.cdr.detectChanges();
    }
  }

  async onImportResultClose() {
    this.showImportResult.set(false);
    this.importReport.set(null);
    await this.loadData();
  }
}