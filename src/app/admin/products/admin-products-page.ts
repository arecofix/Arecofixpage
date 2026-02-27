import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product } from '@app/features/products/domain/entities/product.entity';
import { Brand } from '@app/features/products/domain/entities/brand.entity';
import { AdminProductService, ImportReport } from './services/admin-product.service';
import { Pagination } from '@app/shared/components/pagination/pagination';
import { CommonModule } from '@angular/common';
import { BulkEditModalComponent } from './components/bulk-edit-modal/bulk-edit-modal.component';
import { ImportResultModalComponent } from './components/import-result-modal/import-result-modal.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

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
  public selectedCategoryId = signal<string>('all');
  public sortOrder = signal<'name_asc' | 'price_asc' | 'price_desc' | 'stock_asc' | 'stock_desc'>('name_asc');
  
  // Selection
  public selectedIds = signal<Set<string>>(new Set());
  public isBulkModalOpen = signal(false);
  public bulkInitialTab = signal<'edit' | 'delete'>('edit');
  
  // Pagination
  public currentPage = signal<number>(1);
  public itemsPerPage = signal<number>(20); // Merged client per_page, let's use 20 for admin
  public totalItems = signal<number>(0);
  
  public loading = signal<boolean>(true);
  public importing = signal<boolean>(false);
  public importProgress = signal<string>('');
  public error = signal<string | null>(null);

  // Import result modal
  public importReport = signal<ImportReport | null>(null);
  public showImportResult = signal<boolean>(false);

  private searchSubject = new Subject<string>();

  constructor() {
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe(params => {
      const page = params['_page'] ? Number(params['_page']) : 1;
      const q = params['q'] || '';
      this.currentPage.set(page || 1);
      if (q && q !== this.searchQuery()) {
        this.searchQuery.set(q);
      }
      this.loadData();
    });

    this.searchSubject.pipe(
      takeUntilDestroyed(),
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(query => {
       this.router.navigate([], {
         relativeTo: this.route,
         queryParams: { q: query || null, _page: 1 },
         queryParamsHandling: 'merge'
       });
    });
  }

  // Computed properties
  public paginatedProducts = computed(() => {
    return this.products();
  });

  public totalPages = computed(() => {
     return Math.ceil(this.totalItems() / this.itemsPerPage());
  });

  public isAllSelected = computed(() => {
      const pageItems = this.paginatedProducts();
      if (pageItems.length === 0) return false;
      const selected = this.selectedIds();
      return pageItems.every(p => selected.has(p.id));
  });

  public selectedIdsList = computed(() => Array.from(this.selectedIds()));

  private router = inject(Router);

  async ngOnInit() {
    // Initial load handled by constructor subscribe
  }

  onSearchChange(query: string) {
    this.searchQuery.set(query);
    this.searchSubject.next(query);
  }

  async loadData() {
    this.loading.set(true);
    try {
      // 1. Fetch metadata (brands/categories) only once or if empty
      if (this.brands().length === 0 || this.categories().length === 0) {
        const [brands, categories] = await Promise.all([
            this.productService.getBrands(),
            this.productService.getCategories()
        ]);
        this.brands.set(brands);
        this.categories.set(categories);
      }

      // 2. Fetch paginated products from server
      const sortMap = {
        'name_asc': { column: 'name', order: 'asc' },
        'price_asc': { column: 'price', order: 'asc' },
        'price_desc': { column: 'price', order: 'desc' },
        'stock_asc': { column: 'stock', order: 'asc' },
        'stock_desc': { column: 'stock', order: 'desc' }
      };
      
      const currentSort = sortMap[this.sortOrder()] || sortMap['name_asc'];

      const response = await this.productService.getProductsPaginated({
          _page: this.currentPage(),
          _per_page: this.itemsPerPage(),
          q: this.searchQuery(),
          category_id: this.selectedCategoryId() !== 'all' ? this.selectedCategoryId() : undefined,
          _sort: currentSort.column,
          _order: currentSort.order,
          include_inactive: true
      });

      this.products.set(response.data || []);
      this.totalItems.set(response.items || 0);

    } catch (e: any) {
      this.error.set(e.message || 'Error al cargar datos');
    } finally {
      this.loading.set(false);
      this.cdr.detectChanges();
    }
  }

  updateSort(event: any) {
    this.sortOrder.set(event.target.value);
    this.currentPage.set(1);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { _page: 1 },
      queryParamsHandling: 'merge'
    });
    this.loadData();
  }

  onCategoryChange(event: any) {
    this.selectedCategoryId.set(event.target.value);
    this.currentPage.set(1);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { _page: 1 },
      queryParamsHandling: 'merge'
    });
    this.loadData();
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