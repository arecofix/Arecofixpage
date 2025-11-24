import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/services/auth.service';

@Component({
    selector: 'app-admin-repair-form-page',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './admin-repair-form-page.html',
})
export class AdminRepairFormPage implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private auth = inject(AuthService);

    id: string | null = null;
    form = signal({
        customer_name: '',
        customer_phone: '',
        device_model: '',
        issue_description: '',
        status: 'pending',
        estimated_cost: 0,
        final_cost: 0,
        technician_notes: ''
    });

    loading = signal(true);
    saving = signal(false);
    error = signal<string | null>(null);

    async ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        if (this.id) {
            const supabase = this.auth.getSupabaseClient();
            const { data, error } = await supabase.from('repairs').select('*').eq('id', this.id).single();
            if (data) {
                this.form.set({
                    customer_name: data.customer_name,
                    customer_phone: data.customer_phone || '',
                    device_model: data.device_model,
                    issue_description: data.issue_description || '',
                    status: data.status,
                    estimated_cost: data.estimated_cost || 0,
                    final_cost: data.final_cost || 0,
                    technician_notes: data.technician_notes || ''
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

        // Update completed_at if status changes to completed or delivered
        if (['completed', 'delivered'].includes(payload.status)) {
            (payload as any).completed_at = new Date().toISOString();
        }

        try {
            if (this.id) {
                const { error } = await supabase.from('repairs').update(payload).eq('id', this.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('repairs').insert(payload);
                if (error) throw error;
            }
            this.router.navigate(['/admin/repairs']);
        } catch (e: any) {
            this.error.set(e.message);
        } finally {
            this.saving.set(false);
        }
    }
}
