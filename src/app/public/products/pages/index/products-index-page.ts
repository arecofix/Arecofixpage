import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductCard } from '@app/public/products/components';
import { GetProductsByCategorySlugUseCase } from '@app/core/usecases/products/get-products-by-category-slug.usecase';
import { SeoService } from '@app/core/services/seo.service';
import { firstValueFrom, forkJoin } from 'rxjs';
import { Product } from '@app/shared/interfaces/product.interface';
import { GsmService } from '@app/public/gsm/services/gsm.service';

@Component({
    selector: 'app-products-index-page',
    standalone: true,
    imports: [CommonModule, RouterLink, ProductCard, FormsModule],
    templateUrl: './products-index-page.html',
})
export class ProductsIndexPage implements OnInit {
    private getProductsUseCase = inject(GetProductsByCategorySlugUseCase);
    private seoService = inject(SeoService);
    private router = inject(Router);
    private gsmService = inject(GsmService);

    celulares = signal<Product[]>([]);
    repuestos = signal<Product[]>([]);
    loading = signal(true);
    searchQuery = '';
    
    // Quick View State
    quickViewProduct = signal<Product | null>(null);
    isQuickViewOpen = signal(false);

    ngOnInit() {
        this.setSeoData();
        this.loadData();
    }

    private setSeoData() {
        
    }

    private async loadData() {
        try {
            // Parallel execution using forkJoin
            const [celularesData, repuestosData, rate] = await firstValueFrom(
                forkJoin([
                    this.getProductsUseCase.execute('celulares'),
                    this.getProductsUseCase.execute('repuestos'),
                    this.gsmService.getUsdtRate()
                ])
            );
            
            const mapProduct = (p: Product) => {
                if (p.currency === 'USD') {
                    return {
                        ...p,
                        convertedPrice: p.price * rate
                    };
                }
                return p;
            };

            this.celulares.set((celularesData as Product[]).map(mapProduct));
            this.repuestos.set((repuestosData as Product[]).map(mapProduct));

        } catch (error) {
            console.error('Error loading products', error);
        } finally {
            this.loading.set(false);
        }
    }

    onSearch() {
        if (this.searchQuery.trim()) {
            this.router.navigate(['/products/all'], { queryParams: { q: this.searchQuery } });
        }
    }

    openQuickView(product: Product) {
        this.quickViewProduct.set(product);
        this.isQuickViewOpen.set(true);
    }

    closeQuickView() {
        this.isQuickViewOpen.set(false);
        this.quickViewProduct.set(null);
    }
}
