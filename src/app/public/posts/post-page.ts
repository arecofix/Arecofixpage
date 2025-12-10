import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { Post } from '@app/features/posts/domain/entities/post.entity';
import { PostService } from '@app/features/posts/application/post.service';

@Component({
    selector: 'app-post-page',
    standalone: true,
    imports: [RouterLink, DatePipe],
    templateUrl: './post-page.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostPage implements OnInit {
    private route = inject(ActivatedRoute);
    private postService = inject(PostService);
    private cdr = inject(ChangeDetectorRef);
    private titleService = inject(Title);
    private metaService = inject(Meta);

    post: Post | null = null;
    loading = true;
    error: string | null = null;
    currentSlug: string | null = null;

    async ngOnInit() {
        this.route.paramMap.subscribe(async params => {
            const slug = params.get('slug');
            if (slug) {
                await this.loadPost(slug);
            }
        });
    }

    async loadPost(slug: string) {
        try {
            this.loading = true;
            this.error = null;
            this.post = await this.postService.getPostBySlug(slug);
            this.currentSlug = slug;

            if (this.post) {
                this.updateMetaTags(this.post);
            } else {
                // Retry with corrected slug if 'tcnico' is present (common typo/encoding issue)
                if (slug.includes('tcnico')) {
                    const correctedSlug = slug.replace('tcnico', 'tecnico');
                    this.post = await this.postService.getPostBySlug(correctedSlug);
                    if (this.post) {
                        this.updateMetaTags(this.post);
                        return;
                    }
                }
                this.error = 'Entrada no encontrada';
            }
        } catch (e: any) {
            this.error = 'Error al cargar la entrada';
        } finally {
            this.loading = false;
            this.cdr.markForCheck();
        }
    }

    updateMetaTags(post: Post) {
        this.titleService.setTitle(`${post.title} | Arecofix`);
        if (post.meta_description) {
            this.metaService.updateTag({ name: 'description', content: post.meta_description });
        }
        if (post.meta_title) {
            this.metaService.updateTag({ name: 'title', content: post.meta_title });
        }
    }
}
