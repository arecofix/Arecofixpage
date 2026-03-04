import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '@app/core/services/auth.service';
import { TenantService } from '@app/shared/services/tenant.service';

export interface PaginatedProducts {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  branchInfo: {
    id: string;
    name: string;
    slug: string;
    margin: number;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sale_price?: number;
  sku: string;
  stock: number;
  category: string;
  brand: string;
  image_url: string;
  is_active: boolean;
  is_featured: boolean;
  branch_id?: string;
  is_global: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  price_min?: number;
  price_max?: number;
  search?: string;
  featured?: boolean;
  in_stock?: boolean;
  sort_by?: 'name' | 'price_asc' | 'price_desc' | 'created_at';
}

@Injectable({
  providedIn: 'root'
})
export class BranchStorePaginationService {
  
  constructor(
    private authService: AuthService,
    private tenantService: TenantService
  ) {}

  /**
   * Obtiene productos paginados para una sucursal específica
   * Implementa paginación server-side con Supabase
   */
  getProductsPaginated(
    branchSlug: string,
    page: number = 1,
    limit: number = 12,
    filters: ProductFilters = {}
  ): Observable<PaginatedProducts> {
    
    // Validar acceso a la sucursal
    if (!this.validateBranchAccess(branchSlug)) {
      return throwError(() => new Error('Acceso denegado a esta sucursal'));
    }

    // Calcular offset para paginación
    const offset = (page - 1) * limit;

    // Construir consulta Supabase
    return this.buildSupabaseQuery(branchSlug, offset, limit, filters).pipe(
      map(response => this.formatPaginatedResponse(response, branchSlug, page, limit)),
      catchError(error => {
        console.error('Error loading paginated products:', error);
        return this.getFallbackProducts(branchSlug, page, limit);
      })
    );
  }

  /**
   * Construye la consulta para Supabase con paginación server-side
   */
  private buildSupabaseQuery(
    branchSlug: string,
    offset: number,
    limit: number,
    filters: ProductFilters
  ): Observable<any> {
    
    const supabase = this.authService.getSupabaseClient();
    const currentTenant = this.tenantService.getCurrentTenant();
    const tenantId = currentTenant?.id || '';

    // Query base para productos
    let query = supabase
      .from('products')
      .select(`
        *,
        categories(name),
        brands(name)
      `, { count: 'exact' })
      .eq('tenant_id', tenantId)
      .eq('is_active', true)
      .or(`branch_id.eq.${this.getBranchIdFromSlug(branchSlug)},is_global.eq.true`);

    // Aplicar filtros
    if (filters.category) {
      query = query.eq('categories.name', filters.category);
    }

    if (filters.brand) {
      query = query.eq('brands.name', filters.brand);
    }

    if (filters.price_min !== undefined) {
      query = query.gte('price', filters.price_min);
    }

    if (filters.price_max !== undefined) {
      query = query.lte('price', filters.price_max);
    }

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters.featured !== undefined) {
      query = query.eq('is_featured', filters.featured);
    }

    if (filters.in_stock !== undefined) {
      if (filters.in_stock) {
        query = query.gt('stock', 0);
      } else {
        query = query.eq('stock', 0);
      }
    }

    // Aplicar ordenamiento
    switch (filters.sort_by) {
      case 'name':
        query = query.order('name', { ascending: true });
        break;
      case 'price_asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price', { ascending: false });
        break;
      case 'created_at':
        query = query.order('created_at', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    // Aplicar paginación server-side
    query = query.range(offset, offset + limit - 1);

    // Ejecutar consulta
    return new Observable(observer => {
      query.then(({ data, error, count }) => {
        if (error) {
          observer.error(error);
        } else {
          observer.next({ data, count });
          observer.complete();
        }
      }).catch((error: any) => {
        observer.error(error);
      });
    });
  }

  /**
   * Formatea la respuesta de Supabase al formato esperado
   */
  private formatPaginatedResponse(
    response: any,
    branchSlug: string,
    page: number,
    limit: number
  ): PaginatedProducts {
    
    const { data, count } = response;
    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    // Aplicar márgenes de ganancia a productos globales
    const processedData = data.map((product: any) => 
      this.applyBranchPricing(product, branchSlug)
    );

    return {
      data: processedData,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      branchInfo: {
        id: this.getBranchIdFromSlug(branchSlug),
        name: this.getBranchName(branchSlug),
        slug: branchSlug,
        margin: this.getBranchMargin(branchSlug)
      }
    };
  }

  /**
   * Aplica el margen de ganancia de la sucursal a productos globales
   */
  private applyBranchPricing(product: any, branchSlug: string): Product {
    const branchMargin = this.getBranchMargin(branchSlug);
    const isGlobalProduct = !product.branch_id;
    
    if (isGlobalProduct && branchMargin > 0) {
      const adjustedPrice = Math.round(product.price * (1 + branchMargin / 100));
      const adjustedSalePrice = product.sale_price 
        ? Math.round(product.sale_price * (1 + branchMargin / 100))
        : undefined;

      return {
        ...product,
        price: adjustedPrice,
        sale_price: adjustedSalePrice
      };
    }

    return product;
  }

  /**
   * Obtiene productos de fallback cuando hay errores
   */
  private getFallbackProducts(
    branchSlug: string,
    page: number,
    limit: number
  ): Observable<PaginatedProducts> {
    
    // Productos de ejemplo para fallback
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Producto Ejemplo 1',
        description: 'Descripción del producto de ejemplo',
        price: 10000,
        sku: 'DEMO-001',
        stock: 10,
        category: 'Electrónica',
        brand: 'DemoBrand',
        image_url: 'assets/img/product-placeholder.jpg',
        is_active: true,
        is_featured: true,
        is_global: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Producto Ejemplo 2',
        description: 'Otro producto de ejemplo',
        price: 15000,
        sale_price: 12000,
        sku: 'DEMO-002',
        stock: 5,
        category: 'Accesorios',
        brand: 'DemoBrand',
        image_url: 'assets/img/product-placeholder.jpg',
        is_active: true,
        is_featured: false,
        is_global: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = mockProducts.slice(startIndex, endIndex);

    return of({
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: mockProducts.length,
        totalPages: Math.ceil(mockProducts.length / limit),
        hasNext: page < Math.ceil(mockProducts.length / limit),
        hasPrev: page > 1
      },
      branchInfo: {
        id: this.getBranchIdFromSlug(branchSlug),
        name: this.getBranchName(branchSlug),
        slug: branchSlug,
        margin: this.getBranchMargin(branchSlug)
      }
    });
  }

  /**
   * Valida si el usuario tiene acceso a una sucursal
   */
  private validateBranchAccess(branchSlug: string): boolean {
    // Super Admin puede acceder a cualquier sucursal
    if (this.authService.isSuperAdmin()) {
      return true;
    }

    // Branch Admin solo puede acceder a su sucursal
    const currentProfile = this.authService.getCurrentProfile();
    const userBranchSlug = this.getBranchSlugFromId(currentProfile?.branch_id);
    
    return userBranchSlug === branchSlug;
  }

  /**
   * Obtiene el ID de sucursal a partir del slug
   */
  private getBranchIdFromSlug(branchSlug: string): string {
    const branchMap: Record<string, string> = {
      'zona-norte': 'zona-norte-id',
      'soluciones-del-hogar': 'soluciones-del-hogar-id',
      'default': 'default-branch-id'
    };
    return branchMap[branchSlug] || branchSlug;
  }

  /**
   * Obtiene el slug a partir del ID de sucursal
   */
  private getBranchSlugFromId(branchId?: string): string | null {
    if (!branchId) return null;
    
    const slugMap: Record<string, string> = {
      'zona-norte-id': 'zona-norte',
      'soluciones-del-hogar-id': 'soluciones-del-hogar',
      'default-branch-id': 'default'
    };
    return slugMap[branchId] || null;
  }

  /**
   * Obtiene el nombre de la sucursal
   */
  private getBranchName(branchSlug: string): string {
    const branchNames: Record<string, string> = {
      'zona-norte': 'Sudamericana Enlozados',
      'soluciones-del-hogar': 'Soluciones del Hogar',
      'default': 'Sucursal'
    };
    return branchNames[branchSlug] || 'Sucursal';
  }

  /**
   * Obtiene el margen de ganancia de la sucursal
   */
  private getBranchMargin(branchSlug: string): number {
    const branchMargins: Record<string, number> = {
      'zona-norte': 20,
      'soluciones-del-hogar': 15,
      'default': 10
    };
    return branchMargins[branchSlug] || 10;
  }

  /**
   * Obtiene categorías disponibles para la sucursal
   */
  getCategories(branchSlug: string): Observable<string[]> {
    // En producción, esto vendría de Supabase
    const categories = [
      'Electrónica',
      'Accesorios',
      'Herramientas',
      'Repuestos',
      'Servicios'
    ];
    return of(categories);
  }

  /**
   * Obtiene marcas disponibles para la sucursal
   */
  getBrands(branchSlug: string): Observable<string[]> {
    // En producción, esto vendría de Supabase
    const brands = [
      'DemoBrand',
      'TechPro',
      'QualityTools',
      'ServicePlus'
    ];
    return of(brands);
  }

  /**
   * Obtiene el rango de precios para la sucursal
   */
  getPriceRange(branchSlug: string): Observable<{ min: number; max: number }> {
    // En producción, esto vendría de Supabase
    return of({ min: 1000, max: 50000 });
  }
}
