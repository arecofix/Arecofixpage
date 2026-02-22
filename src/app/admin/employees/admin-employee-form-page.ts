import { Component, inject, OnInit, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';

@Component({
    selector: 'app-admin-employee-form-page',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './admin-employee-form-page.html',
})
export class AdminEmployeeFormPage implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private auth = inject(AuthService);

    id: string | null = null;
    form = signal({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        role: 'staff',
        avatar_url: '',
    });

    loading = signal(true);
    saving = signal(false);
    error = signal<string | null>(null);

    async ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        if (this.id) {
            const supabase = this.auth.getSupabaseClient();
            const { data, error } = await supabase.from('profiles').select('*').eq('id', this.id).single();
            if (data) {
                this.form.set({
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    role: data.role || 'staff',
                    avatar_url: data.avatar_url || '',
                });
            }
        }
        this.loading.set(false);
    }

    async onFileChange(event: any) {
        const file: File = event.target.files?.[0];
        if (!file) return;
        const supabase = this.auth.getSupabaseClient();
        const filePath = `avatars/${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage.from('public-assets').upload(filePath, file);
        if (error) {
            this.error.set(error.message);
            return;
        }
        const { data: publicUrl } = supabase.storage.from('public-assets').getPublicUrl(data.path);
        this.form.update((f) => ({ ...f, avatar_url: publicUrl.publicUrl }));
    }

    async save() {
        this.saving.set(true);
        this.error.set(null);
        const supabase = this.auth.getSupabaseClient();
        const payload = { ...this.form() };

        try {
            if (this.id) {
                const { error } = await supabase.from('profiles').update(payload).eq('id', this.id);
                if (error) throw error;
            } else {
                throw new Error('Creación de nuevos empleados debe hacerse desde el registro o invitación.');
            }
            this.router.navigate(['/admin/employees']);
        } catch (e: any) {
            this.error.set(e.message);
        } finally {
            this.saving.set(false);
        }
    }
}
