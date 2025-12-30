import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService } from '@app/public/categories/services';
import { ProductService } from '@app/public/products/services';
import { ProductCard } from '@app/public/products/components';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-products-index-page',
    standalone: true,
    imports: [CommonModule, RouterLink, ProductCard],
    templateUrl: './products-index-page.html',
})
export class ProductsIndexPage implements OnInit {
    private categoryService = inject(CategoryService);
    private productService = inject(ProductService);

    celulares = signal<any[]>([]);
    repuestos = signal<any[]>([]);
    loading = signal(true);

    async ngOnInit() {
        try {
            await Promise.all([
                this.loadCategoryProducts('celulares', this.celulares),
                this.loadCategoryProducts('repuestos', this.repuestos)
            ]);
        } catch (error) {
            console.error('Error loading products', error);
        } finally {
            this.loading.set(false);
        }
    }

    async loadCategoryProducts(slug: string, signalSetter: any) {
        try {
            // 1. Get Category
            const catRes = await firstValueFrom(this.categoryService.getDataBySlug(slug));
            const category = catRes.data?.[0]; // Assuming response structure

            if (category?.id) {
                // 2. Get Products
                const prodRes = await firstValueFrom(this.productService.getData({ category_id: category.id }));
                signalSetter.set(prodRes.data?.slice(0, 4) || []);
            }
        } catch (e) {
            console.log(`Category ${slug} not found or error`, e);
        }
    }
}
