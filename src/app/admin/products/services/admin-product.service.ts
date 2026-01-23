import { Injectable, inject } from '@angular/core';
import { Product } from '@app/features/products/domain/entities/product.entity';
import { Brand } from '@app/features/products/domain/entities/brand.entity';
import { Category } from '@app/features/products/domain/entities/category.entity';
import { ProductRepository } from '@app/features/products/domain/repositories/product.repository';
import { BrandRepository } from '@app/features/products/domain/repositories/brand.repository';
import { CategoryRepository } from '@app/features/products/domain/repositories/category.repository';
import { AuthService } from '@app/core/services/auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminProductService {
    private productRepo = inject(ProductRepository);
    private brandRepo = inject(BrandRepository);
    private categoryRepo = inject(CategoryRepository);
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
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/&/g, '-and-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-');
    }

    async exportProductsToCSV(): Promise<void> {
        const products = await this.getProducts();
        if (!products.length) return;

        const headers = [
            'id', 'name', 'slug', 'description', 'price', 
            'stock', 'category_id', 'brand_id', 'image_url', 
            'is_active', 'is_featured', 'sku', 'barcode'
        ];

        const csvContent = [
            headers.join(','),
            ...products.map(product => {
                return headers.map(header => {
                    const value = (product as any)[header] || '';
                    // Handle strings with commas or quotes
                    if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
                        return `"${value.replace(/"/g, '""')}"`;
                    }
                    return value;
                }).join(',');
            })
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `products_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    async importProductsFromCSV(file: File): Promise<{ success: number; errors: number }> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (e: any) => {
                try {
                    const csv = e.target.result;
                    const lines = csv.split(/\r\n|\n/);
                    const headers = lines[0].split(',').map((h: string) => h.trim());
                    
                    const productsToUpsert = [];
                    let errorCount = 0;

                    for (let i = 1; i < lines.length; i++) {
                        const line = lines[i].trim();
                        if (!line) continue;

                        // Simple CSV parser that handles quotes
                        const values: string[] = [];
                        let inQuotes = false;
                        let currentValue = '';
                        
                        for (let char of line) {
                            if (char === '"') {
                                inQuotes = !inQuotes;
                            } else if (char === ',' && !inQuotes) {
                                values.push(currentValue);
                                currentValue = '';
                            } else {
                                currentValue += char;
                            }
                        }
                        values.push(currentValue);

                        if (values.length !== headers.length) {
                            console.warn(`Skipping line ${i + 1}: Column count mismatch`);
                            errorCount++;
                            continue;
                        }

                        const product: any = {};
                        headers.forEach((header: string, index: number) => {
                            let value = values[index]?.trim();
                            // Remove surrounding quotes if present
                            if (value?.startsWith('"') && value?.endsWith('"')) {
                                value = value.substring(1, value.length - 1).replace(/""/g, '"');
                            }
                            
                            if (value === '') {
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
                        if (!product.id || product.id === 'new') {
                            delete product.id;
                        }

                        // Basic validation
                        if (product.name && product.price >= 0) {
                            productsToUpsert.push(product);
                        } else {
                            errorCount++;
                        }
                    }

                    if (productsToUpsert.length > 0) {
                        const { error } = await this.supabase
                            .from('products')
                            .upsert(productsToUpsert, { onConflict: 'id' }); // or slug/sku if preferred

                        if (error) throw error;
                    }

                    resolve({ success: productsToUpsert.length, errors: errorCount });
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = (error) => reject(error);
            reader.readAsText(file);
        });
    }

    async bulkUpdate(ids: string[], payload: Partial<Product>): Promise<void> {
        const { error } = await this.supabase
            .from('products')
            .update(payload)
            .in('id', ids);

        if (error) throw error;
    }

    async bulkIncreasePrice(ids: string[], percentage: number): Promise<void> {
        // Strategy: Fetch current prices, calculate new ones, and update.
        // For distinct values, we unfortunately need individual updates or an Upsert.
        // Supabase/PostgREST doesn't support "price = price * 1.1" in simple update yet without RPC.
        
        // 1. Get current products
        const { data: products, error } = await this.supabase
            .from('products')
            .select('id, price')
            .in('id', ids);

        if (error) throw error;
        if (!products || products.length === 0) return;

        // 2. Prepare updates
        const updates = products.map(p => ({
            id: p.id,
            price: Math.round(p.price * (1 + percentage / 100)) // Round to integer for simplicity, or 2 decimals
        }));

        // 3. Perform Upsert (efficient batch update)
        // Note: This requires the table to have a primary key on ID (standard)
        // We only send ID and Price, so we must rely on Supabase not clearing other fields on upsert 
        // IF we use 'ignoreDuplicates: false' (default).
        // However, standard upsert replaces the row. 
        // BETTER APPROACH SAFE: Parallel Updates for now to avoid overwriting other fields 
        // if upsert behavior isn't strictly PATCh. 
        // Actually, upsert overwrites. We don't want that.
        // Let's use Promise.all with a concurrency limit if possible, or just Promise.all for now (Batch size usually < 50).
        
        const BATCH_SIZE = 5;
        for (let i = 0; i < updates.length; i += BATCH_SIZE) {
             const batch = updates.slice(i, i + BATCH_SIZE);
             await Promise.all(batch.map(u => 
                 this.supabase.from('products').update({ price: u.price }).eq('id', u.id)
             ));
        }
    }
}
