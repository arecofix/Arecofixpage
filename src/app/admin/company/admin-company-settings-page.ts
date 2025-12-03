import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@app/core/services/auth.service';

@Component({
    selector: 'app-admin-company-settings-page',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin-company-settings-page.html',
})
export class AdminCompanySettingsPage implements OnInit {
    private auth = inject(AuthService);

    form = signal({
        id: '',
        name: '',
        owner_name: '',
        ruc: '',
        address: '',
        tax_percentage: 21,
        tax_abbreviation: 'IVA',
        email: '',
        phone: '',
        location: '',
        currency: 'ARS',
        logo_url: '',
    });

    loading = signal(true);
    saving = signal(false);
    error = signal<string | null>(null);
    success = signal<string | null>(null);

    async ngOnInit() {
        await this.loadSettings();
    }

    async loadSettings() {
        this.loading.set(true);
        const supabase = this.auth.getSupabaseClient();
        const { data, error } = await supabase.from('company_settings').select('*').maybeSingle();

        if (data) {
            this.form.set({
                id: data.id,
                name: data.name,
                owner_name: data.owner_name || '',
                ruc: data.ruc || '',
                address: data.address || '',
                tax_percentage: data.tax_percentage || 21,
                tax_abbreviation: data.tax_abbreviation || 'IVA',
                email: data.email || '',
                phone: data.phone || '',
                location: data.location || '',
                currency: data.currency || 'ARS',
                logo_url: data.logo_url || '',
            });
        } else if (error && error.code !== 'PGRST116') { // PGRST116 is "The result contains 0 rows"
            this.error.set(error.message);
        }
        this.loading.set(false);
    }

    async onFileChange(event: any) {
        const file: File = event.target.files?.[0];
        if (!file) return;
        const supabase = this.auth.getSupabaseClient();
        const filePath = `company/${Date.now()}-${file.name}`;
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
        this.success.set(null);
        const supabase = this.auth.getSupabaseClient();
        const payload = { ...this.form() };
        // Remove id from payload if it's empty (for insert) but we usually upsert based on ID if exists
        const { id, ...updateData } = payload;

        try {
            if (id) {
                const { error } = await supabase.from('company_settings').update(updateData).eq('id', id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('company_settings').insert(updateData);
                if (error) throw error;
            }
            this.success.set('Configuración guardada correctamente');
            await this.loadSettings(); // Reload to get ID if it was an insert
        } catch (e: any) {
            this.error.set(e.message);
        } finally {
            this.saving.set(false);
        }
    }
}
