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
        const rawImage = data.featured_image || data.image || data.image_url;
        return {
            ...data,
            // Robustly map image from possible DB fields
            image: this.getImageUrl(rawImage)
        } as Post;
    }

    private getImageUrl(pathOrUrl: string | null): string | null {
        if (!pathOrUrl) return null;
        if (pathOrUrl.startsWith('http') || pathOrUrl.startsWith('assets/')) return pathOrUrl;
        
        // If it's a raw path, assume it's in 'public-assets' bucket
        // Check if it already has the bucket name in path
        if (pathOrUrl.includes('public-assets/')) {
             return this.supabase.storage.from('public-assets').getPublicUrl(pathOrUrl.split('public-assets/')[1]).data.publicUrl;
        }

        return this.supabase.storage.from('public-assets').getPublicUrl(pathOrUrl).data.publicUrl;
    }
}
