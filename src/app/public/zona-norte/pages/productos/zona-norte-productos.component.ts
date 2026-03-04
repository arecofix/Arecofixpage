import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ZonaNorteProductsService, Product, ProductFilter } from '../../services/zona-norte-products.service';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { PaginatedResult } from '../../../../shared/services/pagination.service';

@Component({
  selector: 'app-zona-norte-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './zona-norte-productos.component.html',
  styleUrls: ['./zona-norte-productos.component.scss']
})
export class ZonaNorteProductosComponent implements OnInit, OnDestroy {
  
  products: Product[] = [];
  pagination: PaginatedResult<Product> | null = null;
  
  // Filtros
  categories: string[] = [];
  brands: string[] = [];
  priceRange = { min: 0, max: 0 };
  
  currentFilter: ProductFilter = {};
  selectedCategory = '';
  selectedBrand = '';
  selectedPriceRange = '';
  searchQuery = '';
  
  // Estados
  loading = false;
  viewMode: 'grid' | 'list' = 'grid';
  sortBy: 'name' | 'price-asc' | 'price-desc' | 'featured' = 'name';
  
  private subscriptions: Subscription[] = [];

  constructor(private productsService: ZonaNorteProductsService) {}

  ngOnInit(): void {
    this.initializeFilters();
    this.loadProducts();
    this.setupSubscriptions();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initializeFilters(): void {
    this.categories = this.productsService.getCategories();
    this.brands = this.productsService.getBrands();
    const range = this.productsService.getPriceRange();
    this.priceRange = range;
  }

  private setupSubscriptions(): void {
    const productsSub = this.productsService.getProducts().subscribe(result => {
      this.pagination = result;
      this.products = result.data;
      this.loading = false;
    });

    this.subscriptions.push(productsSub);
  }

  private loadProducts(): void {
    this.loading = true;
    this.applyFilters();
  }

  private applyFilters(): void {
    const filter: ProductFilter = {};

    if (this.selectedCategory) {
      filter.category = this.selectedCategory;
    }

    if (this.selectedBrand) {
      filter.brand = this.selectedBrand;
    }

    if (this.searchQuery.trim()) {
      filter.search = this.searchQuery.trim();
    }

    if (this.selectedPriceRange) {
      const ranges = this.selectedPriceRange.split('-');
      if (ranges.length === 2) {
        filter.priceRange = {
          min: parseInt(ranges[0]),
          max: parseInt(ranges[1])
        };
      }
    }

    this.currentFilter = filter;
    this.productsService.applyFilters(filter);
  }

  // Eventos de paginación
  onPageChange(page: number): void {
    this.productsService.goToPage(page);
    // Scroll al top de la lista de productos
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPageSizeChange(pageSize: number): void {
    this.productsService.changePageSize(pageSize);
  }

  // Eventos de filtros
  onCategoryChange(): void {
    this.applyFilters();
  }

  onBrandChange(): void {
    this.applyFilters();
  }

  onPriceRangeChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    // Debounce simple para búsqueda
    setTimeout(() => {
      this.applyFilters();
    }, 300);
  }

  onSortChange(): void {
    if (!this.pagination) return;

    let sortedProducts = [...this.pagination.data];

    switch (this.sortBy) {
      case 'name':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-asc':
        sortedProducts.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-desc':
        sortedProducts.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case 'featured':
        sortedProducts.sort((a, b) => {
          if (a.isFeatured === b.isFeatured) return 0;
          return a.isFeatured ? -1 : 1;
        });
        break;
    }

    this.products = sortedProducts;
  }

  // Métodos de UI
  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  clearFilters(): void {
    this.selectedCategory = '';
    this.selectedBrand = '';
    this.selectedPriceRange = '';
    this.searchQuery = '';
    this.currentFilter = {};
    this.productsService.applyFilters({});
  }

  // Métodos de productos
  getProductPrice(product: Product): number {
    return product.salePrice || product.price;
  }

  hasDiscount(product: Product): boolean {
    return product.salePrice !== undefined && product.salePrice < product.price;
  }

  getDiscountPercentage(product: Product): number {
    if (!this.hasDiscount(product)) return 0;
    return Math.round(((product.price - product.salePrice!) / product.price) * 100);
  }

  isInStock(product: Product): boolean {
    return product.stock > 0;
  }

  getStockStatus(product: Product): string {
    if (product.stock === 0) return 'Sin stock';
    if (product.stock <= 5) return `Últimas ${product.stock} unidades`;
    return 'En stock';
  }

  getStockStatusClass(product: Product): string {
    if (product.stock === 0) return 'out-of-stock';
    if (product.stock <= 5) return 'low-stock';
    return 'in-stock';
  }

  // Formateo de precios
  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  }

  // Contacto
  contactarWhatsApp(product?: Product): void {
    let message = 'Hola, quiero consultar sobre los productos de Sudamericana Enlozados';
    if (product) {
      message = `Hola, quiero consultar sobre el producto: ${product.name} (SKU: ${product.sku})`;
    }
    window.open(`https://wa.me/5491563049494?text=${encodeURIComponent(message)}`, '_blank');
  }

  // Métodos para filtros de precio
  getPriceRanges(): Array<{label: string; value: string}> {
    const { min, max } = this.priceRange;
    const step = (max - min) / 4;
    
    return [
      { label: 'Todos', value: '' },
      { label: `$${this.formatPrice(min)} - $${this.formatPrice(min + step)}`, value: `${min}-${min + step}` },
      { label: `$${this.formatPrice(min + step)} - $${this.formatPrice(min + step * 2)}`, value: `${min + step}-${min + step * 2}` },
      { label: `$${this.formatPrice(min + step * 2)} - $${this.formatPrice(min + step * 3)}`, value: `${min + step * 2}-${min + step * 3}` },
      { label: `$${this.formatPrice(min + step * 3)} - $${this.formatPrice(max)}`, value: `${min + step * 3}-${max}` }
    ];
  }

  // Estadísticas
  getActiveFiltersCount(): number {
    let count = 0;
    if (this.selectedCategory) count++;
    if (this.selectedBrand) count++;
    if (this.selectedPriceRange) count++;
    if (this.searchQuery.trim()) count++;
    return count;
  }

  hasActiveFilters(): boolean {
    return this.getActiveFiltersCount() > 0;
  }
}
