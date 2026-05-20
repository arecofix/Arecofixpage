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

    async getPosts(page?: number, pageSize?: number): Promise<Post[]> {
        return firstValueFrom(this.postsStore.getAdminPosts(page, pageSize));
    }

    async getPost(id: string): Promise<Post | null> {
        return firstValueFrom(this.postsStore.getPostById(id));
    }

    async createPost(payload: Partial<Post>): Promise<void> {
        // Map 'image' to 'featured_image' for DB
        const dbPayload: any = { ...payload };

        // Map image
        if (dbPayload.image) {
            dbPayload.featured_image = dbPayload.image;
            delete dbPayload.image;
        }

        // Remove fields that don't exist in the user's table
        delete dbPayload.meta_title;
        delete dbPayload.meta_description;
        delete dbPayload.published;

        dbPayload.tenant_id = this.tenantService.getTenantId();

        const { error } = await this.supabase.from('blog_posts').insert(dbPayload);
        if (error) throw error;
        this.postsStore.clearCache();
    }

    async updatePost(id: string, payload: Partial<Post>): Promise<void> {
        const dbPayload: any = { ...payload };

        // Map image
        if (dbPayload.image) {
            dbPayload.featured_image = dbPayload.image;
            delete dbPayload.image;
        }

        // Remove fields that don't exist in the user's table
        delete dbPayload.meta_title;
        delete dbPayload.meta_description;
        delete dbPayload.published;

        const { error } = await this.supabase.from('blog_posts')
            .update(dbPayload)
            .eq('id', id)
            .eq('tenant_id', this.tenantService.getTenantId());
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
