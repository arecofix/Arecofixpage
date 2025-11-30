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
    date = new Date();
    form = signal({
        customer_name: '',
        customer_phone: '',
        device_model: '',
        imei: '',
        issue_description: '',
        status: 'pending',
        estimated_cost: 0,
        final_cost: 0,
        technician_notes: '',
        checklist: {
            charger: false,
            battery: false,
            chip: false,
            sd: false,
            case: false
        },
        security_pin: '',
        security_pattern: '',
        deposit_amount: 0,
        tracking_code: '',
        repair_number: 0
    });

    loading = signal(true);
    saving = signal(false);
    error = signal<string | null>(null);
    company = signal<any>(null);

    async ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        await this.loadCompanySettings();
        if (this.id) {
            await this.loadRepair();
        }
        this.loading.set(false);
    }

    async loadCompanySettings() {
        const supabase = this.auth.getSupabaseClient();
        const { data } = await supabase.from('company_settings').select('*').maybeSingle();
        if (data) {
            this.company.set(data);
        }
    }

    async loadRepair() {
        const supabase = this.auth.getSupabaseClient();
        const { data, error } = await supabase.from('repairs').select('*').eq('id', this.id).single();
        if (data) {
            this.form.set({
                customer_name: data.customer_name,
                customer_phone: data.customer_phone || '',
                device_model: data.device_model,
                imei: data.imei || '',
                issue_description: data.issue_description || '',
                status: data.status,
                estimated_cost: data.estimated_cost || 0,
                final_cost: data.final_cost || 0,
                technician_notes: data.technician_notes || '',
                checklist: data.checklist || {
                    charger: false,
                    battery: false,
                    chip: false,
                    sd: false,
                    case: false
                },
                security_pin: data.security_pin || '',
                security_pattern: data.security_pattern || '',
                deposit_amount: data.deposit_amount || 0,
                tracking_code: data.tracking_code || '',
                repair_number: data.repair_number || 0
            });
        }
    }

    generateTrackingCode(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    async save() {
        this.saving.set(true);
        this.error.set(null);
        const supabase = this.auth.getSupabaseClient();
        const payload = { ...this.form() };

        // Generate tracking code if not exists
        if (!payload.tracking_code) {
            payload.tracking_code = this.generateTrackingCode();
            this.form.update(f => ({ ...f, tracking_code: payload.tracking_code }));
        }

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

    printOrder() {
        document.body.classList.add('printing-repair-order');
        // Small delay to ensure styles are applied before print dialog opens
        setTimeout(() => {
            window.print();
            // Remove class after print dialog closes (or immediately if async)
            // Note: In most browsers print() blocks, so this runs after dialog closes.
            document.body.classList.remove('printing-repair-order');
        }, 100);
    }

    shareWhatsApp() {
        if (!this.form().tracking_code) return;

        const customerName = this.form().customer_name;
        const device = this.form().device_model;
        // Fix for HashLocationStrategy: Add /#/ to the URL
        const url = `${window.location.origin}/#/tracking/${this.form().tracking_code}`;

        const message = `Hola ${customerName}, tu ${device} está en reparación. Podés seguir el estado en tiempo real aquí: ${url}`;
        const whatsappUrl = `https://wa.me/${this.form().customer_phone}?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, '_blank');
    }
}
