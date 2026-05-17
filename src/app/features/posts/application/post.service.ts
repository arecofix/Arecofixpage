import { Injectable, inject } from '@angular/core';
import { Post } from '@app/features/posts/domain/entities/post.entity';
import { TenantScopedQueryService } from '@app/core/infrastructure/supabase/tenant-scoped-query.service';

@Injectable({ providedIn: 'root' })
export class PostService {
  private scoped = inject(TenantScopedQueryService);

  async getPostBySlug(slug: string): Promise<Post | null> {
    const { data, error } = await this.scoped
      .withTenantScope(this.scoped.from('blog_posts').select('*'))
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return this.mapToEntity(data);
  }

  async getRecentPosts(limit = 5): Promise<Post[]> {
    const { data, error } = await this.scoped
      .withTenantScope(this.scoped.from('blog_posts').select('*'))
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []).map((item) => this.mapToEntity(item));
  }

  private mapToEntity(data: Record<string, unknown>): Post {
    const rawImage = (data['featured_image'] ?? data['image'] ?? data['image_url']) as string | null;
    return {
      ...(data as object),
      image: this.getImageUrl(rawImage),
    } as Post;
  }

  private getImageUrl(pathOrUrl: string | null): string | null {
    if (!pathOrUrl) return null;
    if (pathOrUrl.startsWith('http') || pathOrUrl.startsWith('assets/')) return pathOrUrl;

    const client = this.scoped.client;
    if (pathOrUrl.includes('public-assets/')) {
      return client.storage
        .from('public-assets')
        .getPublicUrl(pathOrUrl.split('public-assets/')[1]).data.publicUrl;
    }

    return client.storage.from('public-assets').getPublicUrl(pathOrUrl).data.publicUrl;
  }
}
