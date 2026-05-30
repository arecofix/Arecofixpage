import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal, computed } from '@angular/core';
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
    posts = signal<Post[]>([]);
    loading = signal(true);
    error = signal<string | null>(null);
    activeTab = signal<'activos' | 'pendientes'>('activos');

    filteredPosts = computed(() => {
        if (this.activeTab() === 'pendientes') {
            return this.posts().filter(p => p.status === 'draft' || p.status === 'pending');
        }
        return this.posts().filter(p => p.status === 'published');
    });

    activePostsCount = computed(() => this.posts().filter(p => p.status === 'published').length);
    pendingPostsCount = computed(() => this.posts().filter(p => p.status === 'draft' || p.status === 'pending').length);

    async ngOnInit() {
        this.loadPosts();
    }

    async loadPosts() {
        try {
            this.loading.set(true);
            const posts = await this.postService.getPosts();
            this.posts.set(posts);
            this.error.set(null);
        } catch (e: any) {
            this.error.set(e.message || 'Error al cargar entradas');
        } finally {
            this.loading.set(false);
            this.cdr.markForCheck();
        }
    }

    async deletePost(id: string) {
        if (!confirm('¿Estás seguro de eliminar o rechazar esta entrada?')) return;

        try {
            await this.postService.deletePost(id);
            await this.loadPosts();
        } catch (e: any) {
            alert('Error al eliminar: ' + e.message);
        }
    }

    async approvePost(id: string) {
        if (!confirm('¿Aprobar y publicar esta entrada?')) return;

        try {
            await this.postService.approvePost(id);
            await this.loadPosts();
        } catch (e: any) {
            alert('Error al aprobar: ' + e.message);
        }
    }
}
