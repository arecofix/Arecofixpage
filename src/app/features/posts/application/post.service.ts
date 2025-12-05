import { Injectable, inject } from '@angular/core';
import { AuthService } from '@app/core/services/auth.service';
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
            .maybeSingle();

        if (error) {
            console.error('PostService Error:', error);
            throw error;
        }

        if (!data) return null;
        
        return this.mapToEntity(data);
    }

    async getRecentPosts(limit = 5): Promise<Post[]> {
        const { data, error } = await this.supabase
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        
        return (data || []).map((item: any) => this.mapToEntity(item));
    }

    private mapToEntity(data: any): Post {
        return {
            ...data,
            // Robustly map image from possible DB fields
            image: data.featured_image || data.image || data.image_url || null
        } as Post;
    }
}
