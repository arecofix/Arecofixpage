import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminPostService } from './services/admin-post.service';

@Component({
    selector: 'app-admin-post-form-page',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './admin-post-form-page.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPostFormPage implements OnInit {
    private fb = inject(FormBuilder);
    private postService = inject(AdminPostService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private cdr = inject(ChangeDetectorRef);

    form: FormGroup;
    loading = false;
    submitting = false;
    isEdit = false;
    postId: string | null = null;
    imagePreview: string | null = null;

    constructor() {
        this.form = this.fb.group({
            title: ['', [Validators.required]],
            slug: ['', [Validators.required]],
            content: [''],
            published: [false],
            meta_title: [''],
            meta_description: [''],
            image: ['']
        });
    }

    async ngOnInit() {
        this.postId = this.route.snapshot.paramMap.get('id');
        if (this.postId) {
            this.isEdit = true;
            await this.loadPost(this.postId);
        }

        // Auto-generate slug from title
        this.form.get('title')?.valueChanges.subscribe(value => {
            if (!this.isEdit && value && !this.form.get('slug')?.dirty) {
                this.form.patchValue({ slug: this.postService.slugify(value) });
            }
        });
    }

    async loadPost(id: string) {
        try {
            this.loading = true;
            const post = await this.postService.getPost(id);
            this.form.patchValue(post);
            this.imagePreview = post.image || null;
        } catch (error) {
            console.error('Error loading post', error);
            alert('Error al cargar la entrada');
            this.router.navigate(['/admin/posts']);
        } finally {
            this.loading = false;
            this.cdr.markForCheck();
        }
    }

    async onFileSelected(event: any) {
        const file = event.target.files?.[0];
        if (file) {
            try {
                this.loading = true;
                const url = await this.postService.uploadImage(file);
                this.form.patchValue({ image: url });
                this.imagePreview = url;
            } catch (error) {
                console.error('Error uploading image', error);
                alert('Error al subir imagen');
            } finally {
                this.loading = false;
                this.cdr.markForCheck();
            }
        }
    }

    async onSubmit() {
        if (this.form.invalid) return;

        try {
            this.submitting = true;
            const payload = this.form.value;

            if (this.isEdit && this.postId) {
                await this.postService.updatePost(this.postId, payload);
            } else {
                await this.postService.createPost(payload);
            }

            this.router.navigate(['/admin/posts']);
        } catch (error: any) {
            console.error('Error saving post', error);
            alert('Error al guardar: ' + (error.message || error));
        } finally {
            this.submitting = false;
            this.cdr.markForCheck();
        }
    }
}
