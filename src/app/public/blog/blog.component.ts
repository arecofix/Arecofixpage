import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PostService } from '@app/features/posts/application/post.service';
import { Post } from '@app/features/posts/domain/entities/post.entity';
import { SeoService } from '@app/core/services/seo.service';


@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog.component.html',
})
export class BlogComponent {
  private postService = inject(PostService);
  private seoService = inject(SeoService);

  posts = signal<Post[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  async ngOnInit() {
    this.seoService.setPageData({
      title: 'Blog de Tecnología y Reparación',
      description: 'Novedades, guías de reparación y noticias del mundo tecnológico de Marcos Paz. Mantente actualizado con Arecofix.',
      imageUrl: 'assets/img/branding/og-blog.jpg'
    });
    try {
      const posts = await this.postService.getRecentPosts(100);
      this.posts.set(posts);
    } catch (err) {
      this.error.set('Error al cargar los artículos.');
    } finally {
      this.loading.set(false);
    }
  }
}
