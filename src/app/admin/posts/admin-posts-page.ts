import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Post } from '@app/features/posts/domain/entities/post.entity';
import { AdminPostService } from './services/admin-post.service';

@Component({
    selector: 'app-admin-posts-page',
    standalone: true,
    imports: [RouterLink, DatePipe],
    templateUrl: './admin-posts-page.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPostsPage implements OnInit {
    private postService = inject(AdminPostService);
    private cdr = inject(ChangeDetectorRef);
    posts: Post[] = [];
    loading = true;
    error: string | null = null;

    async ngOnInit() {
        this.loadPosts();
    }

    async loadPosts() {
        try {
            this.loading = true;
            this.posts = await this.postService.getPosts();
        } catch (e: any) {
            this.error = e.message || 'Error al cargar entradas';
        } finally {
            this.loading = false;
            this.cdr.markForCheck();
        }
    }

    async deletePost(id: string) {
        if (!confirm('¿Estás seguro de eliminar esta entrada?')) return;

        try {
            await this.postService.deletePost(id);
            await this.loadPosts();
        } catch (e: any) {
            alert('Error al eliminar: ' + e.message);
        }
    }
}
