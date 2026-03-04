import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface PaginationConfig {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationConfig;
}

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  
  private defaultLimit = 12; // 12 productos por página
  
  constructor() { }

  /**
   * Pagina un array de datos
   */
  paginate<T>(data: T[], page: number = 1, limit: number = this.defaultLimit): PaginatedResult<T> {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedData = data.slice(startIndex, endIndex);
    const totalPages = Math.ceil(data.length / limit);
    
    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: data.length,
        totalPages
      }
    };
  }

  /**
   * Genera el array de números de página para mostrar
   */
  getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxVisible = 5; // Máximo 5 páginas visibles
    
    if (totalPages <= maxVisible) {
      // Si hay menos páginas que el máximo, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Si hay muchas páginas, mostrar con elipsis
      if (currentPage <= 3) {
        // Near start
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near end
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Middle
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  }

  /**
   * Verifica si una página está activa
   */
  isPageActive(page: number | string, currentPage: number): boolean {
    return page === currentPage;
  }

  /**
   * Verifica si una página está deshabilitada
   */
  isPageDisabled(page: number | string, currentPage: number, totalPages: number): boolean {
    if (page === 'prev') return currentPage === 1;
    if (page === 'next') return currentPage === totalPages;
    return false;
  }

  /**
   * Obtiene la página anterior
   */
  getPreviousPage(currentPage: number): number {
    return Math.max(1, currentPage - 1);
  }

  /**
   * Obtiene la página siguiente
   */
  getNextPage(currentPage: number, totalPages: number): number {
    return Math.min(totalPages, currentPage + 1);
  }

  /**
   * Calcula el rango de items mostrados
   */
  getItemRange(currentPage: number, limit: number, total: number): string {
    const start = (currentPage - 1) * limit + 1;
    const end = Math.min(currentPage * limit, total);
    return `${start}-${end} de ${total}`;
  }

  /**
   * BehaviorSubject para manejar el estado de paginación
   */
  createPaginationState<T>(initialData: T[] = []) {
    const paginationState = new BehaviorSubject<PaginatedResult<T>>({
      data: [],
      pagination: {
        page: 1,
        limit: this.defaultLimit,
        total: 0,
        totalPages: 0
      }
    });

    return {
      paginationState,
      updatePage: (page: number, limit?: number) => {
        const currentLimit = limit || this.defaultLimit;
        const result = this.paginate(initialData, page, currentLimit);
        paginationState.next(result);
      },
      updateData: (newData: T[], page?: number, limit?: number) => {
        initialData = newData;
        const currentPage = page || 1;
        const currentLimit = limit || this.defaultLimit;
        const result = this.paginate(newData, currentPage, currentLimit);
        paginationState.next(result);
      }
    };
  }
}
