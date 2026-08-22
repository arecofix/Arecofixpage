import {
  Component,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PostService } from '@app/features/posts/application/post.service';
import { Post } from '@app/features/posts/domain/entities/post.entity';
import { SeoService } from '@app/core/services/seo.service';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './blog.component.html',
})
export class BlogComponent {
  private postService = inject(PostService);
  private seoService = inject(SeoService);
  public authService = inject(AuthService);

  officialPosts = signal<Post[]>([]);
  communityPosts = signal<Post[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  async ngOnInit() {
    this.seoService.setPageData({
      title: 'Blog y Comunidad Tech',
      description:
        'Artículos, noticias y tutoriales sobre reparación de celulares, tablets, microsoldadura y tecnología. Espacio abierto para la comunidad técnica.',
      imageUrl: 'https://arecofix.com.ar/assets/img/branding/programacion.jpg', // Using a generic image to detach from Arecofix main brand
      type: 'website',
    });

    try {
      const allPosts = await this.postService.getRecentPosts(100);
      const publicPosts = allPosts.filter(
        (p) => p.published || p.status === 'published',
      );

      this.officialPosts.set(
        publicPosts.filter(
          (p) =>
            p.author_role === 'admin' ||
            p.author_role === 'super_admin' ||
            p.author_role === 'tenant_owner',
        ),
      );
      this.communityPosts.set(
        publicPosts.filter(
          (p) =>
            p.author_role !== 'admin' &&
            p.author_role !== 'super_admin' &&
            p.author_role !== 'tenant_owner',
        ),
      );
    } catch (err) {
      this.officialPosts.set([]);
      this.communityPosts.set([]);
    } finally {
      this.loading.set(false);
    }
  }
}
