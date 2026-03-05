import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationConfig } from '../../services/pagination.service';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnChanges {
  
  @Input() pagination!: PaginationConfig;
  @Input() showItemRange = true;
  @Input() showPageSizeSelector = false;
  @Input() pageSizeOptions = [12, 24, 48, 96];
  
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  pageNumbers: (number | string)[] = [];
  itemRange: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pagination'] && this.pagination) {
      this.updatePageNumbers();
      this.updateItemRange();
    }
  }

  private updatePageNumbers(): void {
    // Importamos el servicio dinámicamente para evitar dependencias circulares
    import('../../services/pagination.service').then(module => {
      const paginationService = module.PaginationService;
      const service = new paginationService();
      this.pageNumbers = service.getPageNumbers(this.pagination.page, this.pagination.totalPages);
    });
  }

  private updateItemRange(): void {
    if (this.showItemRange) {
      this.itemRange = this.getItemRange();
    }
  }

  private getItemRange(): string {
    const start = (this.pagination.page - 1) * this.pagination.limit + 1;
    const end = Math.min(this.pagination.page * this.pagination.limit, this.pagination.total);
    return `${start}-${end} de ${this.pagination.total}`;
  }

  onPageClick(page: number | string): void {
    if (typeof page === 'number' && page !== this.pagination.page) {
      this.pageChange.emit(page);
    }
  }

  onPreviousPage(): void {
    if (this.pagination.page > 1) {
      this.pageChange.emit(this.pagination.page - 1);
    }
  }

  onNextPage(): void {
    if (this.pagination.page < this.pagination.totalPages) {
      this.pageChange.emit(this.pagination.page + 1);
    }
  }

  onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newPageSize = parseInt(select.value);
    this.pageSizeChange.emit(newPageSize);
  }

  isPageActive(page: number | string): boolean {
    return page === this.pagination.page;
  }

  isPageDisabled(type: 'prev' | 'next'): boolean {
    if (type === 'prev') return this.pagination.page === 1;
    if (type === 'next') return this.pagination.page === this.pagination.totalPages;
    return false;
  }

  isEllipsis(page: number | string): boolean {
    return page === '...';
  }
}
