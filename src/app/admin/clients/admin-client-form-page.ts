import { Component, inject, OnInit, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { TenantService } from '@app/core/services/tenant.service';

@Component({
    selector: 'app-admin-client-form-page',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './admin-client-form-page.html',
})
export class AdminClientFormPage implements OnInit {
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
        address: '',
        dni: '',
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
                    address: data.address || '', 
                    dni: data.dni || '',
                });
            }
        }
        this.loading.set(false);
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
                const { error } = await supabase.rpc('create_client', {
                    p_first_name: payload.first_name,
                    p_last_name: payload.last_name,
                    p_email: payload.email,
                    p_phone: payload.phone,
                    p_address: payload.address,
                    p_dni: payload.dni,
                    p_tenant_id: this.tenantService.getTenantId()
                });
                
                if (error) {
                    // Fallback local error handling message
                    console.error(error);
                    throw new Error('Error al registrar cliente: ' + error.message + '. Asegúrate de correr la actualización SQL de la base de datos (docs/create-client-rpc.sql).');
                }
            }
            this.router.navigate(['/admin/clients']);
        } catch (e: any) {
            this.error.set(e.message);
        } finally {
            this.saving.set(false);
        }
    }
}
