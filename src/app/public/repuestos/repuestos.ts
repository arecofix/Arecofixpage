import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { switchMap, of, map, catchError } from 'rxjs';
import { IsEmptyComponent, IsErrorComponent, IsLoadingComponent } from '@app/shared/components/resource-status';
import { CategoryService } from '@app/public/categories/services';
import { ProductService } from '@app/public/products/services';
import { ProductCard } from '@app/public/products/components';
import { FallbackService } from '@app/core/services/fallback.service';
import { Pagination, PaginationService, iPagination } from '@app/shared/components/pagination';
import { iCategoriesResponse } from '@app/public/categories/interfaces';

@Component({
    selector: 'app-repuestos',
    standalone: true,
    imports: [CommonModule, FormsModule, IsEmptyComponent, IsErrorComponent, IsLoadingComponent, ProductCard, Pagination],
    templateUrl: './repuestos.html',
    styleUrl: './repuestos.scss'
})
export class RepuestosComponent implements OnInit {
    private router = inject(Router);
    private categoryService = inject(CategoryService);
    private productService = inject(ProductService);
    public paginationService = inject(PaginationService);

    categories = [
        {
            id: 1,
            name: 'Pantallas',
            icon: 'fa-mobile-screen',
            description: 'Displays y pantallas para todas las marcas',
            itemCount: 150
        },
        {
            id: 2,
            name: 'Baterías',
            icon: 'fa-battery-full',
            description: 'Baterías originales y compatibles',
            itemCount: 200
        },
        {
            id: 3,
            name: 'Cámaras',
            icon: 'fa-camera',
            description: 'Cámaras frontales y traseras',
            itemCount: 80
        },
        {
            id: 4,
            name: 'Conectores',
            icon: 'fa-plug',
            description: 'Conectores de carga y audio',
            itemCount: 120
        },
        {
            id: 5,
            name: 'Herramientas',
            icon: 'fa-screwdriver-wrench',
            description: 'Kit de herramientas profesionales',
            itemCount: 45
        },
        {
            id: 6,
            name: 'Accesorios',
            icon: 'fa-headphones',
            description: 'Fundas, protectores y más',
            itemCount: 300
        }
    ];

    featuredProducts = [
        {
            id: 1,
            name: 'Pantalla iPhone 12',
            price: '$35,000',
            originalPrice: '$45,000',
            image: 'assets/img/products/iphx.webp',
            stock: 'En stock',
            rating: 4.8
        },
        {
            id: 2,
            name: 'Batería Samsung A31',
            price: '$8,500',
            originalPrice: '$12,000',
            image: 'assets/img/products/sam.webp',
            stock: 'En stock',
            rating: 4.7
        },
        {
            id: 3,
            name: 'Kit Herramientas Pro',
            price: '$15,000',
            originalPrice: '$20,000',
            image: 'assets/img/cursos/laboratorio.webp',
            stock: 'Últimas unidades',
            rating: 4.9
        },
        {
            id: 4,
            name: 'Pantalla Motorola G8',
            price: '$12,000',
            originalPrice: '$16,000',
            image: 'assets/img/products/motorola.webp',
            stock: 'En stock',
            rating: 4.6
        }
    ];

    brands = [
        { name: 'Samsung', logo: 'assets/img/brands/samsung.webp' },
        { name: 'Apple', logo: 'assets/img/brands/iphone.webp' },
        { name: 'Motorola', logo: 'assets/img/brands/motorola.webp' },
        { name: 'Xiaomi', logo: 'assets/img/brands/sunshine.webp' }
    ];

    // New: full catalog to enable filtering
    products = [
        {
            id: 101,
            name: 'Pantalla iPhone 12',
            priceLabel: '$35,000',
            priceNumber: 35000,
            image: 'assets/img/products/iphx.webp',
            stock: 'En stock',
            rating: 4.8,
            category: 'Pantallas',
            brand: 'Apple'
        },
        {
            id: 102,
            name: 'Batería Samsung A31',
            priceLabel: '$8,500',
            priceNumber: 8500,
            image: 'assets/img/products/sam.webp',
            stock: 'En stock',
            rating: 4.7,
            category: 'Baterías',
            brand: 'Samsung'
        },
        {
            id: 103,
            name: 'Kit Herramientas Pro',
            priceLabel: '$15,000',
            priceNumber: 15000,
            image: 'assets/img/cursos/laboratorio.webp',
            stock: 'Últimas unidades',
            rating: 4.9,
            category: 'Herramientas',
            brand: 'Sunshine'
        },
        {
            id: 104,
            name: 'Pantalla Motorola G8',
            priceLabel: '$12,000',
            priceNumber: 12000,
            image: 'assets/img/products/motorola.webp',
            stock: 'En stock',
            rating: 4.6,
            category: 'Pantallas',
            brand: 'Motorola'
        },
        {
            id: 105,
            name: 'Pantalla iPhone 8 Plus',
            priceLabel: '$20,000',
            priceNumber: 20000,
            image: 'assets/img/products/iph8plus.webp',
            stock: 'En stock',
            rating: 4.5,
            category: 'Pantallas',
            brand: 'Apple'
        },
        {
            id: 106,
            name: 'Batería Motorola G8',
            priceLabel: '$7,000',
            priceNumber: 7000,
            image: 'assets/img/products/motorola.webp',
            stock: 'En stock',
            rating: 4.3,
            category: 'Baterías',
            brand: 'Motorola'
        }
    ];

    // Filtros
    filter = {
        search: '',
        category: 'all' as string,
        brand: 'all' as string,
        maxPrice: null as number | null,
        sort: 'relevance' as 'relevance' | 'price-asc' | 'price-desc' | 'rating-desc',
    };

    filteredProducts: any[] = [];

    // Productos vinculados a la categoría "herramientas" (o cursos si se prefiere)
    // Usamos 'herramientas' ya que es más relevante para repuestos, pero el usuario pidió "Productos para Estudiantes"
    // que suele estar asociado a kits de herramientas.
    // Productos destacados para estudiantes (o general)
    private fallbackService = inject(FallbackService);

    productsRs = rxResource({
        stream: () => {
            const fallbackData = this.fallbackService.getAllFallbackProducts();

            return this.productService.getData({
                featured: true,
                _page: this.paginationService.currentPage() || 1,
                _per_page: 4
            }).pipe(
                map(response => {
                    if (!response.data || response.data.length < 3) {
                        return { ...response, data: fallbackData, items: fallbackData.length, pages: 1 } as any;
                    }
                    return response;
                }),
                catchError(() => of({ data: fallbackData, items: fallbackData.length, pages: 1 } as any))
            );
        }
    });

    paginationData = computed<iPagination | null>(() => {
        const data = this.productsRs.value();
        if (!data) return null;
        const {
            first,
            prev,
            next,
            last,
            pages,
            items
        } = data as any;

        return {
            first,
            prev,
            next,
            last,
            pages,
            items
        } as iPagination;
    });

    ngOnInit() {
        this.applyFilters();
    }

    applyFilters() {
        const txt = this.filter.search.trim().toLowerCase();
        const cat = this.filter.category;
        const brand = this.filter.brand;
        const maxPrice = this.filter.maxPrice;

        let result = this.products.filter(p => {
            const matchesText = !txt || p.name.toLowerCase().includes(txt);
            const matchesCat = cat === 'all' || p.category === cat;
            const matchesBrand = brand === 'all' || p.brand === brand;
            const matchesPrice = !maxPrice || p.priceNumber <= maxPrice;
            return matchesText && matchesCat && matchesBrand && matchesPrice;
        });

        switch (this.filter.sort) {
            case 'price-asc':
                result = result.sort((a, b) => a.priceNumber - b.priceNumber);
                break;
            case 'price-desc':
                result = result.sort((a, b) => b.priceNumber - a.priceNumber);
                break;
            case 'rating-desc':
                result = result.sort((a, b) => b.rating - a.rating);
                break;
            default:
                // relevance: keep current ordering
                break;
        }

        this.filteredProducts = result;
    }

    // Helper: brand list from existing brands array if present
    get brandOptions() {
        return ['Samsung', 'Apple', 'Motorola', 'Sunshine'];
    }

    goToHome() {
        this.router.navigate(['/'])
    }
}
