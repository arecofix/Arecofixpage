import { Injectable, inject } from '@angular/core';
import { AuthService } from '@app/core/services/auth.service';
import { Post } from '@app/features/posts/domain/entities/post.entity';

@Injectable({
    providedIn: 'root'
})
export class AdminPostService {
    private auth = inject(AuthService);
    private supabase = this.auth.getSupabaseClient();

    async getPosts(): Promise<Post[]> {
        const { data, error } = await this.supabase
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []).map((post: any) => ({
            ...post,
            image: post.featured_image || post.image || post.image_url // Try all likely names
        }));
    }

    async getPost(id: string): Promise<Post> {
        const { data, error } = await this.supabase
            .from('blog_posts')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return {
            ...data,
            image: data.featured_image || data.image || data.image_url
        };
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

        const { error } = await this.supabase.from('blog_posts').insert(dbPayload);
        if (error) throw error;
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

        const { error } = await this.supabase.from('blog_posts').update(dbPayload).eq('id', id);
        if (error) throw error;
    }

    async deletePost(id: string): Promise<void> {
        const { error } = await this.supabase.from('blog_posts').delete().eq('id', id);
        if (error) throw error;
    }

    async uploadImage(file: File): Promise<string> {
        const filePath = `posts/${Date.now()}-${file.name}`;
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
