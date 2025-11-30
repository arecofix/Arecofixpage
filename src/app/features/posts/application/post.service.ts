import { Injectable, inject } from '@angular/core';
import { AuthService } from '@app/services/auth.service';
import { Post } from '@app/features/posts/domain/entities/post.entity';

@Injectable({
    providedIn: 'root'
})
export class PostService {
    private auth = inject(AuthService);
    private supabase = this.auth.getSupabaseClient();

    async getPostBySlug(slug: string): Promise<Post | null> {
        const { data, error } = await this.supabase
            .from('blog_posts')
            .select('*')
            .eq('slug', slug)
            // .eq('published', true) // Column doesn't exist
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            throw error;
        }
        return {
            ...data,
            image: data.featured_image || data.image || data.image_url
        };
    }

    async getRecentPosts(limit = 5): Promise<Post[]> {
        const { data, error } = await this.supabase
            .from('blog_posts')
            .select('*')
            // .eq('published', true) // Column doesn't exist
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return (data || []).map((post: any) => ({
            ...post,
            image: post.featured_image || post.image || post.image_url
        }));
    }
}
