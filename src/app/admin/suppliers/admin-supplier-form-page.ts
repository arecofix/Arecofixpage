import { Component, inject, OnInit, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';

@Component({
    selector: 'app-admin-supplier-form-page',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './admin-supplier-form-page.html',
})
export class AdminSupplierFormPage implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private auth = inject(AuthService);

    id: string | null = null;
    form = signal({
        name: '',
        type: '',
        rubro: '',
        address: '',
        cuil: '',
        email: '',
        phone: '',
        is_active: true,
    });

    loading = signal(true);
    saving = signal(false);
    error = signal<string | null>(null);

    async ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        if (this.id) {
            const supabase = this.auth.getSupabaseClient();
            const { data, error } = await supabase.from('suppliers').select('*').eq('id', this.id).single();
            if (data) {
                this.form.set({
                    name: data.name,
                    type: data.type || '',
                    rubro: data.rubro || '',
                    address: data.address || '',
                    cuil: data.tax_id || '', // Map tax_id to cuil
                    email: data.email || '',
                    phone: data.phone || '',
                    is_active: data.is_active,
                });
            }
        }
        this.loading.set(false);
    }

    async save() {
        this.saving.set(true);
        this.error.set(null);
        const supabase = this.auth.getSupabaseClient();
        const payload: any = {
            name: this.form().name,
            type: this.form().type,
            rubro: this.form().rubro,
            address: this.form().address,
            tax_id: this.form().cuil, // Map cuil to tax_id
            email: this.form().email,
            phone: this.form().phone,
            is_active: this.form().is_active
        };

        try {
            if (this.id) {
                const { error } = await supabase.from('suppliers').update(payload).eq('id', this.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('suppliers').insert(payload);
                if (error) throw error;
            }
            this.router.navigate(['/admin/suppliers']);
        } catch (e: any) {
            this.error.set(e.message);
        } finally {
            this.saving.set(false);
        }
    }
}
