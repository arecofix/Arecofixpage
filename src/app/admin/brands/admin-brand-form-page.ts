import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/services/auth.service';

@Component({
    selector: 'app-admin-brand-form-page',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './admin-brand-form-page.html',
})
export class AdminBrandFormPage implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private auth = inject(AuthService);

    id: string | null = null;
    form = signal({
        name: '',
        slug: '',
        logo_url: '',
        is_active: true,
    });

    loading = signal(true);
    saving = signal(false);
    error = signal<string | null>(null);

    async ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        if (this.id) {
            const supabase = this.auth.getSupabaseClient();
            const { data, error } = await supabase.from('brands').select('*').eq('id', this.id).single();
            if (data) {
                this.form.set({
                    name: data.name,
                    slug: data.slug,
                    logo_url: data.logo_url || '',
                    is_active: data.is_active,
                });
            }
        }
        this.loading.set(false);
    }

    async onFileChange(event: any) {
        const file: File = event.target.files?.[0];
        if (!file) return;
        const supabase = this.auth.getSupabaseClient();
        const filePath = `brands/${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage.from('public-assets').upload(filePath, file);
        if (error) {
            this.error.set(error.message);
            return;
        }
        const { data: publicUrl } = supabase.storage.from('public-assets').getPublicUrl(data.path);
        this.form.update((f) => ({ ...f, logo_url: publicUrl.publicUrl }));
    }

    async save() {
        this.saving.set(true);
        this.error.set(null);
        const supabase = this.auth.getSupabaseClient();
        const payload = { ...this.form() };

        if (!payload.slug) {
            payload.slug = this.slugify(payload.name);
        }

        try {
            if (this.id) {
                const { error } = await supabase.from('brands').update(payload).eq('id', this.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('brands').insert(payload);
                if (error) throw error;
            }
            this.router.navigate(['/admin/brands']);
        } catch (e: any) {
            this.error.set(e.message);
        } finally {
            this.saving.set(false);
        }
    }

    private slugify(text: string): string {
        return text.toString().toLowerCase().trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-');
    }
}
