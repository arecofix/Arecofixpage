import {
  Component,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { TenantScopedQueryService } from '@app/core/infrastructure/supabase/tenant-scoped-query.service';
import { Post } from '@app/features/posts/domain/entities/post.entity';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './create-post.component.html',
})
export class CreatePostComponent {
  private authService = inject(AuthService);
  private scoped = inject(TenantScopedQueryService);
  private router = inject(Router);

  isSubmitting = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  // Form Model
  post: Partial<Post> = {
    title: '',
    content: '',
    image: '',
    meta_title: '',
    meta_description: '',
  };

  async submitPost() {
    this.error.set(null);
    const user = this.authService.getCurrentUser();

    if (!user) {
      this.error.set('Debes estar logueado para crear una publicación.');
      return;
    }

    if (!this.post.title || !this.post.content) {
      this.error.set(
        'Por favor completa el título y el contenido de la publicación.',
      );
      return;
    }

    this.isSubmitting.set(true);

    try {
      const payload = {
        title: this.post.title,
        content: this.post.content,
        featured_image: this.post.image, // Note: the DB column is featured_image according to admin service
        seo_title: this.post.meta_title || this.post.title,
        seo_description:
          this.post.meta_description || this.post.content?.substring(0, 150),
        slug: this.post.title
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, ''),
        author: user.id, // DB column is author
        status: 'draft', // Draft equals pending for admin approval
      };

      const finalPayload = this.scoped.withTenant(payload);
      const { error } = await this.scoped
        .from('blog_posts')
        .insert(finalPayload);

      if (error) throw error;

      this.success.set(true);
      setTimeout(() => {
        this.router.navigate(['/blog']);
      }, 3000);
    } catch (err: any) {
      console.error(err);
      this.error.set('Hubo un error al enviar tu publicación. ' + err.message);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
