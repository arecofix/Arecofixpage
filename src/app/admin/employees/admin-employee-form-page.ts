import { Component, inject, OnInit, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { TenantService } from '@app/core/services/tenant.service';

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
    private tenantService = inject(TenantService);

    id: string | null = null;
    form = signal({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        role: 'staff',
        avatar_url: '',
        password: '',
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
                    password: '', // We don't fetch passwords, it's only here to satisfy type logic when saving
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
        
        // Exclude password from standard updates
        const { password, ...updatePayload } = this.form();

        try {
            if (this.id) {
                const { error } = await supabase.from('profiles').update(updatePayload).eq('id', this.id);
                if (error) throw error;
            } else {
                if (!password || password.length < 6) {
                    throw new Error('La contraseña debe tener al menos 6 caracteres.');
                }
                const { error } = await supabase.rpc('create_employee', {
                    p_first_name: updatePayload.first_name,
                    p_last_name: updatePayload.last_name,
                    p_email: updatePayload.email,
                    p_phone: updatePayload.phone,
                    p_role: updatePayload.role,
                    p_password: password,
                    p_avatar_url: updatePayload.avatar_url,
                    p_tenant_id: this.tenantService.getTenantId()
                });
                if (error) {
                     console.error(error);
                     throw new Error('Error al registrar empleado: ' + error.message + '. Asegúrate de correr la actualización SQL de la base de datos (docs/create-employee-rpc.sql).');
                }
            }
            this.router.navigate(['/admin/employees']);
        } catch (e: any) {
            this.error.set(e.message);
        } finally {
            this.saving.set(false);
        }
    }
}
