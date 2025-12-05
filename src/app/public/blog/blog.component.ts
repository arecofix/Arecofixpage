import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PostService } from '@app/features/posts/application/post.service';
import { Post } from '@app/features/posts/domain/entities/post.entity';


@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog.component.html',
})
export class BlogComponent {
  private postService = inject(PostService);

  posts = signal<Post[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  async ngOnInit() {
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
