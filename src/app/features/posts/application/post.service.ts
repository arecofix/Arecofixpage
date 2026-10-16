import { Injectable, inject } from '@angular/core';
import { Post, PostComment } from '@app/features/posts/domain/entities/post.entity';
import { TenantScopedQueryService } from '@app/core/infrastructure/supabase/tenant-scoped-query.service';

@Injectable({ providedIn: 'root' })
export class PostService {
  private scoped = inject(TenantScopedQueryService);

  async getPostBySlug(slug: string): Promise<Post | null> {
    const { data, error } = await this.scoped
      .withTenantScope(this.scoped.from('blog_posts').select('*, profiles(role)'))
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (error || !data) {
      try {
        if (typeof window !== 'undefined') {
          const response = await fetch('/assets/data/fallback_blog_posts.json');
          if (response.ok) {
            const fallbackData = (await response.json()) as Record<string, unknown>[];
            const found = fallbackData.find((p) => p['slug'] === slug);
            if (found) return this.mapToEntity(found);
          }
        }
      } catch (e) {
        console.warn('Fallback failed', e);
      }
      return null;
    }

    return this.mapToEntity(data);
  }

  async getRecentPosts(limit = 5): Promise<Post[]> {
    const { data, error } = await this.scoped
      .withTenantScope(this.scoped.from('blog_posts').select('*, profiles(role)'))
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) {
      try {
        if (typeof window !== 'undefined') {
          const response = await fetch('/assets/data/fallback_blog_posts.json');
          if (response.ok) {
            const fallbackData = (await response.json()) as Record<string, unknown>[];
            return fallbackData.slice(0, limit).map((d) => this.mapToEntity(d));
          }
        }
      } catch (e) {
        console.warn('Fallback failed', e);
      }
      return [];
    }

    return data.map((d) => this.mapToEntity(d));
  }

  async getComments(postId: string): Promise<PostComment[]> {
    const { data, error } = await this.scoped.client
      .from('post_comments')
      .select('*')
      .eq('post_id', postId)
      .eq('status', 'approved')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as PostComment[];
  }

  async addComment(postId: string, userName: string, comment: string): Promise<PostComment> {
    const { data, error } = await this.scoped.client
      .from('post_comments')
      .insert({
        post_id: postId,
        user_name: userName,
        comment: comment,
        status: 'approved' // Automatically approved for simplicity, or pending if you prefer
      })
      .select()
      .single();

    if (error) throw error;
    return data as PostComment;
  }

  private mapToEntity(data: Record<string, unknown>): Post {
    const rawImage = (data['featured_image'] ?? data['image'] ?? data['image_url']) as string | null;
    let role: string | undefined = undefined;
    if (data['profiles'] && typeof data['profiles'] === 'object' && !Array.isArray(data['profiles'])) {
        role = (data['profiles'] as { role?: string }).role;
    } else if (Array.isArray(data['profiles']) && data['profiles'].length > 0) {
        role = (data['profiles'][0] as { role?: string })?.role;
    }

    return {
      id: data['id'] as string,
      created_at: data['created_at'] as string,
      updated_at: data['updated_at'] as string,
      title: data['title'] as string,
      slug: data['slug'] as string,
      content: data['content'] as string,
      image: this.getImageUrl(rawImage),
      published: data['status'] === 'published',
      meta_title: (data['seo_title'] || data['meta_title']) as string | undefined,
      meta_description: (data['seo_description'] || data['meta_description']) as string | undefined,
      template: (data['template'] || 'modern') as string,
      author: data['author'] as string | undefined,
      author_role: role,
    };
  }

  private getImageUrl(pathOrUrl: string | null): string {
    if (!pathOrUrl) return 'assets/img/servicios/pantalla.jpg';
    if (pathOrUrl.startsWith('assets/')) return pathOrUrl;

    // Map known legacy 404 images from old defunct storage or dead URLs to valid local assets
    if (
      pathOrUrl.includes('jftiyfnnaogmgvksgkbn.supabase.co') ||
      pathOrUrl.includes('api.arecofix.com.ar/public-assets') ||
      pathOrUrl.includes('1764621227166') ||
      pathOrUrl.includes('1764621102072') ||
      pathOrUrl.includes('1764621290350') ||
      pathOrUrl.includes('1764784353818') ||
      pathOrUrl.includes('1780271564143') ||
      pathOrUrl.includes('1764621178905') ||
      pathOrUrl.includes('1769624494183') ||
      pathOrUrl.includes('1764620943181') ||
      pathOrUrl.includes('1764620763896')
    ) {
      if (pathOrUrl.includes('auriculares_apple') || pathOrUrl.includes('iphone')) {
        return 'assets/img/repair/iphone.webp';
      }
      if (pathOrUrl.includes('auriculares') || pathOrUrl.includes('1000128639')) {
        return 'assets/img/repair/apple.webp';
      }
      if (pathOrUrl.includes('placa') || pathOrUrl.includes('515994911')) {
        return 'assets/img/servicios/placa.jpg';
      }
      if (pathOrUrl.includes('play') || pathOrUrl.includes('play4')) {
        return 'assets/img/repair/1.webp';
      }
      if (pathOrUrl.includes('girl') || pathOrUrl.includes('express')) {
        return 'assets/img/repair/tecnico.webp';
      }
      if (pathOrUrl.includes('Mariano') || pathOrUrl.includes('28egdow')) {
        return 'assets/img/repair/2.webp';
      }
      return 'assets/img/servicios/pantalla.jpg';
    }

    if (pathOrUrl.startsWith('http')) return pathOrUrl;

    const client = this.scoped.client;
    if (pathOrUrl.includes('public-assets/')) {
      return client.storage
        .from('public-assets')
        .getPublicUrl(pathOrUrl.split('public-assets/')[1]).data.publicUrl;
    }

    return client.storage.from('public-assets').getPublicUrl(pathOrUrl).data.publicUrl;
  }
}
