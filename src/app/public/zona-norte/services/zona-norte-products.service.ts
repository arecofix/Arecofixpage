import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PaginationService, PaginatedResult } from '../../../shared/services/pagination.service';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  imageUrl: string;
  category: string;
  brand: string;
  stock: number;
  sku: string;
  isFeatured: boolean;
  isActive: boolean;
  specifications?: Record<string, any>;
}

export interface ProductFilter {
  category?: string;
  brand?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  search?: string;
  featured?: boolean;
  inStock?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ZonaNorteProductsService {
  
  private products: Product[] = [];
  private filteredProducts: Product[] = [];
  private productsSubject = new BehaviorSubject<PaginatedResult<Product>>({
    data: [],
    pagination: {
      page: 1,
      limit: 12,
      total: 0,
      totalPages: 0
    }
  });

  private filterSubject = new BehaviorSubject<ProductFilter>({});
  private currentPageSubject = new BehaviorSubject<number>(1);
  private pageSizeSubject = new BehaviorSubject<number>(12);

  constructor(private paginationService: PaginationService) {
    this.initializeMockProducts();
  }

  /**
   * Inicializa productos de ejemplo para la sucursal Zona Norte
   */
  private initializeMockProducts(): void {
    this.products = [
      {
        id: '1',
        name: 'Kit Enlozado Bañera Premium',
        description: 'Kit completo para enlozado de bañeras con resina alemana de alta calidad',
        price: 15000,
        salePrice: 12000,
        imageUrl: 'assets/img/branches/zona-norte/products/kit-banera-premium.jpg',
        category: 'Enlozado',
        brand: 'Sudamericana',
        stock: 25,
        sku: 'ZNE-001',
        isFeatured: true,
        isActive: true,
        specifications: {
          'tipo': 'Resina alemana',
          'rendimiento': '2-3 bañeras',
          'tiempo_secado': '3 horas',
          'garantia': '2 años'
        }
      },
      {
        id: '2',
        name: 'Resina para Sanitarios',
        description: 'Resina especializada para restauración de sanitarios y bidets',
        price: 8000,
        imageUrl: 'assets/img/branches/zona-norte/products/resina-sanitarios.jpg',
        category: 'Sanitarios',
        brand: 'Sudamericana',
        stock: 40,
        sku: 'ZNS-002',
        isFeatured: false,
        isActive: true,
        specifications: {
          'tipo': 'Resina sanitaria',
          'colores': 'Blanco, Hueso, Negro',
          'aplicacion': 'Pincel o rodillo',
          'secado': '4 horas'
        }
      },
      {
        id: '3',
        name: 'Pasta para Azulejos',
        description: 'Pasta especial para instalación y restauración de azulejos',
        price: 3500,
        salePrice: 2800,
        imageUrl: 'assets/img/branches/zona-norte/products/pasta-azulejos.jpg',
        category: 'Azulejos',
        brand: 'Sudamericana',
        stock: 60,
        sku: 'ZNA-003',
        isFeatured: true,
        isActive: true,
        specifications: {
          'tipo': 'Pasta cementicia',
          'rendimiento': '3 m² por kg',
          'colores': 'Blanco, Gris, Beige',
          'secado': '24 horas'
        }
      },
      {
        id: '4',
        name: 'Laca para Parquet Alto Tránsito',
        description: 'Laca profesional de alto tránsito para pisos de madera',
        price: 12000,
        imageUrl: 'assets/img/branches/zona-norte/products/laca-parquet.jpg',
        category: 'Parquet',
        brand: 'Sudamericana',
        stock: 30,
        sku: 'ZNP-004',
        isFeatured: false,
        isActive: true,
        specifications: {
          'tipo': 'Laca poliuretánica',
          'acabado': 'Brillante/Satinado',
          'rendimiento': '8-10 m² por litro',
          'secado': '12 horas'
        }
      },
      {
        id: '5',
        name: 'Kit Restauración Jacuzzi',
        description: 'Kit especializado para restauración de jacuzzis e hidromasajes',
        price: 18000,
        salePrice: 15000,
        imageUrl: 'assets/img/branches/zona-norte/products/kit-jacuzzi.jpg',
        category: 'Enlozado',
        brand: 'Sudamericana',
        stock: 15,
        sku: 'ZNJ-005',
        isFeatured: true,
        isActive: true,
        specifications: {
          'tipo': 'Resina premium',
          'compatible_con': 'Jacuzzi, hidromasajes',
          'resistencia_quimica': 'Alta',
          'garantia': '3 años'
        }
      },
      {
        id: '6',
        name: 'Sellador para Juntas',
        description: 'Sellador flexible para juntas de azulejos y sanitarios',
        price: 2500,
        imageUrl: 'assets/img/branches/zona-norte/products/sellador-juntas.jpg',
        category: 'Azulejos',
        brand: 'Sudamericana',
        stock: 80,
        sku: 'ZNJ-006',
        isFeatured: false,
        isActive: true,
        specifications: {
          'tipo': 'Silicona flexible',
          'colores': 'Transparente, Blanco, Gris',
          'aplicacion': 'Pistola o cartucho',
          'secado': '1 hora'
        }
      },
      {
        id: '7',
        name: 'Abrillantador para Metales',
        description: 'Abrillantador profesional para griferías y accesorios de baño',
        price: 1800,
        imageUrl: 'assets/img/branches/zona-norte/products/abrillantador-metales.jpg',
        category: 'Sanitarios',
        brand: 'Sudamericana',
        stock: 100,
        sku: 'ZNS-007',
        isFeatured: false,
        isActive: true,
        specifications: {
          'tipo': 'Abrillantador líquido',
          'ph': 'Neutro',
          'dilucion': '1:10',
          'rendimiento': '500 ml por 10 litros'
        }
      },
      {
        id: '8',
        name: 'Masilla para Madera',
        description: 'Masilla especial para reparación de parquet antes del pulido',
        price: 2200,
        imageUrl: 'assets/img/branches/zona-norte/products/masilla-madera.jpg',
        category: 'Parquet',
        brand: 'Sudamericana',
        stock: 50,
        sku: 'ZNP-008',
        isFeatured: false,
        isActive: true,
        specifications: {
          'tipo': 'Masilla a base de agua',
          'colores': 'Madera clara, oscura, nogal',
          'secado': '2 horas',
          'lijar': 'Después de 4 horas'
        }
      },
      {
        id: '9',
        name: 'Limpiador de Resinas',
        description: 'Limpiador especializado para herramientas y superficies con resina',
        price: 1200,
        imageUrl: 'assets/img/branches/zona-norte/products/limpiador-resinas.jpg',
        category: 'Enlozado',
        brand: 'Sudamericana',
        stock: 120,
        sku: 'ZNE-009',
        isFeatured: false,
        isActive: true,
        specifications: {
          'tipo': 'Solvente orgánico',
          'presentacion': '1 litro',
          'aplicacion': 'Trapo o pincel',
          'seguridad': 'Usar con ventilación'
        }
      },
      {
        id: '10',
        name: 'Cinta de Enmascarar',
        description: 'Cinta de alta calidad para delimitar áreas de trabajo',
        price: 800,
        imageUrl: 'assets/img/branches/zona-norte/products/cinta-enmascarar.jpg',
        category: 'Herramientas',
        brand: 'Sudamericana',
        stock: 200,
        sku: 'ZNH-010',
        isFeatured: false,
        isActive: true,
        specifications: {
          'tipo': 'Cinta de papel',
          'ancho': '25 mm',
          'longitud': '50 metros',
          'resistencia': 'Alta temperatura'
        }
      },
      {
        id: '11',
        name: 'Rodillo de Espuma',
        description: 'Rodillo profesional para aplicación de resinas y lacas',
        price: 600,
        imageUrl: 'assets/img/branches/zona-norte/products/rodillo-espuma.jpg',
        category: 'Herramientas',
        brand: 'Sudamericana',
        stock: 150,
        sku: 'ZNH-011',
        isFeatured: false,
        isActive: true,
        specifications: {
          'tipo': 'Espuma de alta densidad',
          'medida': '20 cm',
          'compatible': 'Resinas, lacas, pinturas',
          'lavable': 'Sí'
        }
      },
      {
        id: '12',
        name: 'Kit Mantenimiento Bañera',
        description: 'Kit completo para mantenimiento mensual de bañeras enlozadas',
        price: 3500,
        salePrice: 2800,
        imageUrl: 'assets/img/branches/zona-norte/products/kit-mantenimiento.jpg',
        category: 'Enlozado',
        brand: 'Sudamericana',
        stock: 40,
        sku: 'ZNE-012',
        isFeatured: true,
        isActive: true,
        specifications: {
          'contenido': 'Limpiador, protector, paño',
          'frecuencia': 'Uso mensual',
          'duracion': '6 meses',
          'compatibilidad': 'Todos los tipos de resina'
        }
      },
      {
        id: '13',
        name: 'Pasta Niveladora',
        description: 'Pasta niveladora para preparación de superficies',
        price: 4200,
        imageUrl: 'assets/img/branches/zona-norte/products/pasta-niveladora.jpg',
        category: 'Azulejos',
        brand: 'Sudamericana',
        stock: 35,
        sku: 'ZNA-013',
        isFeatured: false,
        isActive: true,
        specifications: {
          'tipo': 'Cemento nivelador',
          'espesor': '1-5 mm',
          'rendimiento': '2 m² por saco',
          'secado': '48 horas'
        }
      },
      {
        id: '14',
        name: 'Lija de Agua',
        description: 'Set de lijas de agua para pulido fino de superficies',
        price: 1500,
        imageUrl: 'assets/img/branches/zona-norte/products/lija-agua.jpg',
        category: 'Parquet',
        brand: 'Sudamericana',
        stock: 80,
        sku: 'ZNP-014',
        isFeatured: false,
        isActive: true,
        specifications: {
          'tipos': '320, 400, 600, 800, 1000',
          'cantidad': '5 hojas',
          'uso': 'Húmedo o seco',
          'calidad': 'Profesional'
        }
      },
      {
        id: '15',
        name: 'Protector de Superficies',
        description: 'Protector transparente para superficies enlozadas',
        price: 5500,
        imageUrl: 'assets/img/branches/zona-norte/products/protector-superficies.jpg',
        category: 'Enlozado',
        brand: 'Sudamericana',
        stock: 25,
        sku: 'ZNE-015',
        isFeatured: false,
        isActive: true,
        specifications: {
          'tipo': 'Barniz transparente',
          'acabado': 'Mate o brillante',
          'rendimiento': '6 m² por litro',
          'proteccion': 'UV y química'
        }
      }
    ];

    this.filteredProducts = [...this.products];
    this.updatePaginatedProducts();
  }

  /**
   * Obtiene los productos paginados como Observable
   */
  getProducts(): Observable<PaginatedResult<Product>> {
    return this.productsSubject.asObservable();
  }

  /**
   * Aplica filtros a los productos
   */
  applyFilters(filter: ProductFilter): void {
    this.filterSubject.next(filter);
    this.filteredProducts = this.filterProducts(this.products, filter);
    this.currentPageSubject.next(1); // Resetear a primera página
    this.updatePaginatedProducts();
  }

  /**
   * Cambia la página actual
   */
  goToPage(page: number): void {
    this.currentPageSubject.next(page);
    this.updatePaginatedProducts();
  }

  /**
   * Cambia el tamaño de página
   */
  changePageSize(pageSize: number): void {
    this.pageSizeSubject.next(pageSize);
    this.currentPageSubject.next(1); // Resetear a primera página
    this.updatePaginatedProducts();
  }

  /**
   * Filtra productos según los criterios
   */
  private filterProducts(products: Product[], filter: ProductFilter): Product[] {
    return products.filter(product => {
      // Filtro por categoría
      if (filter.category && product.category !== filter.category) {
        return false;
      }

      // Filtro por marca
      if (filter.brand && product.brand !== filter.brand) {
        return false;
      }

      // Filtro por rango de precio
      if (filter.priceRange) {
        const price = product.salePrice || product.price;
        if (price < filter.priceRange.min || price > filter.priceRange.max) {
          return false;
        }
      }

      // Filtro por búsqueda
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        if (!product.name.toLowerCase().includes(searchLower) &&
            !product.description.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Filtro por destacados
      if (filter.featured !== undefined && product.isFeatured !== filter.featured) {
        return false;
      }

      // Filtro por stock
      if (filter.inStock && product.stock <= 0) {
        return false;
      }

      // Solo productos activos
      if (!product.isActive) {
        return false;
      }

      return true;
    });
  }

  /**
   * Actualiza los productos paginados
   */
  private updatePaginatedProducts(): void {
    const currentPage = this.currentPageSubject.value;
    const pageSize = this.pageSizeSubject.value;
    
    const result = this.paginationService.paginate(
      this.filteredProducts,
      currentPage,
      pageSize
    );
    
    this.productsSubject.next(result);
  }

  /**
   * Obtiene categorías disponibles
   */
  getCategories(): string[] {
    const categories = [...new Set(this.products.map(p => p.category))];
    return categories.sort();
  }

  /**
   * Obtiene marcas disponibles
   */
  getBrands(): string[] {
    const brands = [...new Set(this.products.map(p => p.brand))];
    return brands.sort();
  }

  /**
   * Obtiene rangos de precios
   */
  getPriceRange(): { min: number; max: number } {
    const prices = this.products.map(p => p.salePrice || p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }

  /**
   * Obtiene productos destacados
   */
  getFeaturedProducts(limit: number = 6): Product[] {
    return this.products
      .filter(p => p.isFeatured && p.isActive)
      .slice(0, limit);
  }

  /**
   * Busca producto por ID
   */
  getProductById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  /**
   * Obtiene productos relacionados
   */
  getRelatedProducts(productId: string, limit: number = 4): Product[] {
    const product = this.getProductById(productId);
    if (!product) return [];

    return this.products
      .filter(p => p.id !== productId && p.category === product.category && p.isActive)
      .slice(0, limit);
  }
}
