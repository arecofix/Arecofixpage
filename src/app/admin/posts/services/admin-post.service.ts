import { Injectable, inject } from '@angular/core';
import { AuthService } from '@app/core/services/auth.service';
import { TenantService } from '@app/core/services/tenant.service';
import { Post } from '@app/features/posts/domain/entities/post.entity';
import { PostsStore } from '@app/features/posts/application/services/posts.store';
import { firstValueFrom } from 'rxjs';
import { SupabaseStorageService } from '@app/core/services/supabase-storage.service';

@Injectable({
    providedIn: 'root'
})
export class AdminPostService {
    private auth = inject(AuthService);
    private tenantService = inject(TenantService);
    private supabase = this.auth.getSupabaseClient();
    private postsStore = inject(PostsStore);
    private storageService = inject(SupabaseStorageService);

    async getPosts(): Promise<Post[]> {
        const { data, error } = await this.supabase
            .from('blog_posts')
            .select('id, title, slug, excerpt, content, featured_image, created_at, updated_at, view_count, category_id, status, seo_title, seo_description, author, template')
            .eq('tenant_id', this.tenantService.getTenantId())
            .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []).map((post: any) => this.mapToEntity(post));
    }

    async getPost(id: string): Promise<Post | null> {
        const { data, error } = await (this.supabase
            .from('blog_posts')
            .select('id, title, slug, excerpt, content, featured_image, created_at, updated_at, view_count, category_id, status, seo_title, seo_description, author, template')
            .eq('id', id)
            .eq('tenant_id', this.tenantService.getTenantId()) as any)
            .maybeSingle();

        if (error) throw error;
        return data ? this.mapToEntity(data) : null;
    }

    private mapToEntity(data: any): Post {
        return {
            id: data.id,
            created_at: data.created_at,
            updated_at: data.updated_at,
            title: data.title,
            slug: data.slug,
            content: data.content,
            image: data.featured_image || undefined,
            published: data.status === 'published',
            status: data.status,
            meta_title: data.seo_title || undefined,
            meta_description: data.seo_description || undefined,
            template: data.template || 'modern'
        };
    }

    async createPost(payload: Partial<Post>): Promise<void> {
        // console.log('AdminPostService.createPost called with payload', payload);
        const dbPayload: any = {
            title: payload.title,
            slug: payload.slug,
            content: payload.content,
            featured_image: payload.image || null,
            status: payload.published ? 'published' : 'draft',
            seo_title: payload.meta_title || null,
            seo_description: payload.meta_description || null,
            template: payload.template || 'modern',
            tenant_id: this.tenantService.getTenantId()
        };

        // console.log('Executing supabase insert with payload:', dbPayload);
        const { error } = await this.supabase.from('blog_posts').insert(dbPayload).select();
        // console.log('Supabase insert finished. Error:', error);
        
        if (error) throw error;
        this.postsStore.clearCache();
        // console.log('Cache cleared successfully.');
    }

    async updatePost(id: string, payload: Partial<Post>): Promise<void> {
        // console.log('AdminPostService.updatePost called with id:', id, 'payload:', payload);
        const dbPayload: any = {
            title: payload.title,
            slug: payload.slug,
            content: payload.content,
            featured_image: payload.image || null,
            status: payload.published ? 'published' : 'draft',
            seo_title: payload.meta_title || null,
            seo_description: payload.meta_description || null,
            template: payload.template || 'modern'
        };

        // console.log('Executing supabase update with payload:', dbPayload);
        
        const updatePromise = this.supabase.from('blog_posts')
            .update(dbPayload)
            .eq('id', id)
            .eq('tenant_id', this.tenantService.getTenantId())
            .select();
            
        const timeoutPromise = new Promise<{error: any, data: any}>((resolve) => {
            setTimeout(() => resolve({ error: new Error('SUPABASE_UPDATE_TIMEOUT: El servidor no respondió en 15s'), data: null }), 15000);
        });

        const { error } = await Promise.race([updatePromise, timeoutPromise]);
            
        // console.log('Supabase update finished. Error:', error);
        if (error) throw error;
        this.postsStore.clearCache();
    }

    async deletePost(id: string): Promise<void> {
        const { error } = await this.supabase.from('blog_posts')
            .delete()
            .eq('id', id)
            .eq('tenant_id', this.tenantService.getTenantId());
        if (error) throw error;
        this.postsStore.clearCache();
    }

    async approvePost(id: string): Promise<void> {
        const { error } = await this.supabase.from('blog_posts')
            .update({ status: 'published' })
            .eq('id', id)
            .eq('tenant_id', this.tenantService.getTenantId());
        if (error) throw error;
        this.postsStore.clearCache();
    }

    async uploadImage(file: File): Promise<string> {
        return this.storageService.uploadFile(file, 'posts');
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
