import { Injectable, inject } from '@angular/core';
import { Post } from '@app/features/posts/domain/entities/post.entity';
import { PostsStore } from './services/posts.store';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PostService {
    private postsStore = inject(PostsStore);

    async getPostBySlug(slug: string): Promise<Post | null> {
        return firstValueFrom(this.postsStore.getPostBySlug(slug));
    }

    async getRecentPosts(limit = 5): Promise<Post[]> {
        return firstValueFrom(this.postsStore.getRecentPosts(limit));
    }
}
