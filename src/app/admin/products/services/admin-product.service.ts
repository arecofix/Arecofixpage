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
    // Needed for storage and bulk ops not yet in repo
    private auth = inject(AuthService);
    private supabase = this.auth.getSupabaseClient();

    async getProducts(): Promise<Product[]> {
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
        const filePath = `products/${Date.now()}-${file.name}`;
        const { data, error } = await this.supabase.storage.from('public-assets').upload(filePath, file);

        if (error) throw error;

        const { data: publicUrl } = this.supabase.storage.from('public-assets').getPublicUrl(data.path);
        return publicUrl.publicUrl;
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
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (e: ProgressEvent<FileReader>) => {
                try {
                    const csv = e.target?.result as string;
                    if (!csv) throw new Error('Empty file');
                    
                    // Use CsvService logic if we want, but since we have specific mapping logic here that relies on indices...
                    // Actually, CsvService parses lines. We can reuse parseLine logic if public, or just refactor whole thing.
                    // Let's rely on standard CsvService.
                    // Wait, CsvService returns parsed objects based on a callback.
                    
                    const result = await this.csvService.parse<Product>(file, (values, headers) => {
                        const product: Record<string, any> = {};
                        
                        headers.forEach((header: string, index: number) => {
                            let value = values[index]?.trim();
                             // Remove surrounding quotes if present (CsvService handles this if parseLine does, but CsvService.parseLine handles quotes internally)
                             // wait, CsvService.parse calls parseLine which returns clean values?
                             // Yes, parseLine in CsvService handles quotes and returns clean values.
                             // So we just take the value.
                            
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

                        // Remove id if it's empty or new placeholder to allow auto-generation
                        if (!product['id'] || product['id'] === 'new') {
                             delete product['id'];
                        }

                        // Basic validation
                        if (product['name'] && (product['price'] === undefined || product['price'] >= 0)) {
                             return product as Product;
                        }
                        return null;
                    });
                    
                    const productsToUpsert = result.data;
                    
                    if (productsToUpsert.length > 0) {
                        try {
                            const upserted = await firstValueFrom(this.productRepo.upsertMany(productsToUpsert));
                            // success count = imported/updated count
                            resolve({ success: upserted.length, errors: result.errors });
                        } catch (e) {
                             reject(e);
                        }
                    } else {
                        resolve({ success: 0, errors: result.errors });
                    }
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = (error) => reject(error);
            reader.readAsText(file);
        });
    }

    async bulkUpdate(ids: string[], payload: Partial<Product>): Promise<void> {
        // Prepare updates for each ID
        const updates = ids.map(id => ({ id, ...payload }));
        await firstValueFrom(this.productRepo.updateMany(updates));
    }

    async bulkIncreasePrice(ids: string[], percentage: number): Promise<void> {
        // 1. Get current products
        const response = await firstValueFrom(this.productRepo.findWithFilters({ ids: ids }));
        const products = response.data; // Access data property from response

        if (!products || products.length === 0) return;

        // 2. Prepare updates
        const updates = products.map(p => ({
            id: p.id,
            price: Math.round(p.price * (1 + percentage / 100))
        }));

        // 3. Perform Update
        await firstValueFrom(this.productRepo.updateMany(updates));
    }
}
