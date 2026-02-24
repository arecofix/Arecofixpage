import { Injectable, inject } from '@angular/core';
import { Product } from '@app/features/products/domain/entities/product.entity';
import { Brand } from '@app/features/products/domain/entities/brand.entity';
import { Category } from '@app/features/products/domain/entities/category.entity';
import { ProductRepository } from '@app/features/products/domain/repositories/product.repository';
import { BrandRepository } from '@app/features/products/domain/repositories/brand.repository';
import { CategoryRepository } from '@app/features/products/domain/repositories/category.repository';
import { AuthService } from '@app/core/services/auth.service';
import { CsvService } from '@app/shared/services/csv.service';
import { StringUtils } from '@app/shared/utils/string.utils';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminProductService {
    private productRepo = inject(ProductRepository);
    private brandRepo = inject(BrandRepository);
    private categoryRepo = inject(CategoryRepository);
    private csvService = inject(CsvService);
    private auth = inject(AuthService);

    async getProducts(): Promise<Product[]> {
        const user = this.auth.getCurrentUser();
        if (user) {
            const profile = await this.auth.getUserProfile(user.id);
            return firstValueFrom(this.productRepo.getAll(profile?.branch_id));
        }
        return firstValueFrom(this.productRepo.getAll());
    }

    async getProduct(id: string): Promise<Product> {
        return firstValueFrom(this.productRepo.getById(id));
    }

    async getBrands(): Promise<Brand[]> {
        return firstValueFrom(this.brandRepo.getAll());
    }

    async getCategories(): Promise<Category[]> {
        return firstValueFrom(this.categoryRepo.getAll());
    }

    async createProduct(payload: Partial<Product>): Promise<void> {
        await firstValueFrom(this.productRepo.create(payload as Product));
    }

    async updateProduct(id: string, payload: Partial<Product>): Promise<void> {
        await firstValueFrom(this.productRepo.update(id, payload));
    }

    async uploadImage(file: File): Promise<string> {
        return this.productRepo.uploadImage(file);
    }

    slugify(text: string): string {
        return StringUtils.slugify(text);
    }

    async exportProductsToCSV(): Promise<void> {
        const products = await this.getProducts();
        if (!products.length) return;

        const headers = [
            'id', 'name', 'slug', 'description', 'price', 
            'stock', 'category_id', 'brand_id', 'image_url', 
            'is_active', 'is_featured', 'sku', 'barcode'
        ];

        this.csvService.exportToCsv(products, 'products_export', headers);
    }

    async importProductsFromCSV(file: File): Promise<{ success: number; errors: number }> {
        const result = await this.csvService.parse<Product>(file, (values, headers) => {
            const product: Record<string, any> = {};
            
            headers.forEach((header: string, index: number) => {
                let value = values[index]?.trim();
                
                if (value === '' || value === undefined) {
                    product[header] = null;
                } else if (header === 'price' || header === 'stock' || header === 'min_stock_alert') {
                    product[header] = Number(value);
                } else if (header === 'is_active' || header === 'is_featured') {
                    product[header] = value.toLowerCase() === 'true';
                } else {
                    product[header] = value;
                }
            });

            if (!product['id'] || product['id'] === 'new') {
                 delete product['id'];
            }

            if (product['name'] && (product['price'] === undefined || product['price'] >= 0)) {
                 return product as Product;
            }
            return null;
        });
        
        const productsToUpsert = result.data;
        
        if (productsToUpsert.length > 0) {
            const upserted = await firstValueFrom(this.productRepo.upsertMany(productsToUpsert));
            return { success: upserted.length, errors: result.errors };
        } else {
            return { success: 0, errors: result.errors };
        }
    }

    async bulkUpdate(ids: string[], payload: Partial<Product>): Promise<void> {
        const updates = ids.map(id => ({ id, ...payload }));
        await firstValueFrom(this.productRepo.updateMany(updates));
    }

    async bulkCustomUpdate(updates: Partial<Product>[]): Promise<void> {
        await firstValueFrom(this.productRepo.upsertMany(updates));
    }

    async bulkIncreasePrice(ids: string[], percentage: number): Promise<void> {
        const response = await firstValueFrom(this.productRepo.findWithFilters({ ids: ids }));
        const products = response.data;

        if (!products || products.length === 0) return;

        const updates = products.map(p => ({
            id: p.id,
            price: Math.round(p.price * (1 + percentage / 100))
        }));

        await firstValueFrom(this.productRepo.updateMany(updates));
    }
}
