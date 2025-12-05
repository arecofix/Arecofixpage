import { Injectable, inject } from '@angular/core';
import { AuthService } from '@app/core/services/auth.service';
import { Product } from '@app/features/products/domain/entities/product.entity';

@Injectable({
    providedIn: 'root'
})
export class AdminProductService {
    private auth = inject(AuthService);
    private supabase = this.auth.getSupabaseClient();

    async getProducts(): Promise<Product[]> {
        const { data, error } = await this.supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    }

    async getProduct(id: string): Promise<any> {
        const { data, error } = await this.supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    }

    async getBrands(): Promise<any[]> {
        const { data, error } = await this.supabase
            .from('brands')
            .select('*')
            .eq('is_active', true)
            .order('name');

        if (error) throw error;
        return data || [];
    }

    async getCategories(): Promise<any[]> {
        const { data, error } = await this.supabase
            .from('categories')
            .select('*')
            .eq('is_active', true)
            .order('name');

        if (error) throw error;
        return data || [];
    }

    async createProduct(payload: any): Promise<void> {
        const { error } = await this.supabase.from('products').insert(payload);
        if (error) throw error;
    }

    async updateProduct(id: string, payload: any): Promise<void> {
        const { error } = await this.supabase.from('products').update(payload).eq('id', id);
        if (error) throw error;
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
}
