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
}
