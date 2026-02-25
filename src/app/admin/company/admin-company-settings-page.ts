import { Component, inject, OnInit, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AuthService } from '@app/core/services/auth.service';
import { TenantService } from '@app/core/services/tenant.service';

@Component({
    selector: 'app-admin-company-settings-page',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './admin-company-settings-page.html',
})
export class AdminCompanySettingsPage implements OnInit {
    private auth = inject(AuthService);
    private tenantService = inject(TenantService);

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

    // Branches Setup
    branches = signal<any[]>([]);
    newBranch = signal({ name: '', address: '', is_active: true });
    savingBranch = signal(false);

    async ngOnInit() {
        await this.loadSettings();
    }

    async loadSettings() {
        this.loading.set(true);
        const supabase = this.auth.getSupabaseClient();
        const tenantId = this.tenantService.getTenantId();
        
        const { data, error } = await supabase.from('tenants')
            .select('*')
            .eq('id', tenantId)
            .single();

        if (data) {
            this.form.set({
                id: data.id,
                name: data.name,
                owner_name: '', // Removed from schema
                ruc: data.tax_id_name || 'CUIT/CUIL', // Mapped to tax_id_name roughly
                address: data.location || '',
                tax_percentage: data.tax_percentage || 21,
                tax_abbreviation: data.tax_abbreviation || 'IVA',
                email: data.contact_email || '',
                phone: data.contact_phone || '',
                location: data.location || '',
                currency: data.currency || 'ARS',
                logo_url: data.branding_settings?.logo_url || '',
            });
        } else if (error && error.code !== 'PGRST116') { // PGRST116 is "The result contains 0 rows"
            this.error.set(error.message);
        }

        // Load Branches
        const { data: branchData } = await supabase.from('branches')
            .select('*')
            .eq('tenant_id', tenantId)
            .order('name');
        
        this.branches.set(branchData || []);
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
        const tenantId = this.tenantService.getTenantId();

        const updateData = {
            name: payload.name,
            tax_id_name: payload.ruc,
            location: payload.address || payload.location, // Merging address/location
            tax_percentage: payload.tax_percentage,
            tax_abbreviation: payload.tax_abbreviation,
            contact_email: payload.email,
            contact_phone: payload.phone,
            currency: payload.currency,
            branding_settings: {
                logo_url: payload.logo_url,
                primary_color: '#3b82f6'
            },
            updated_at: new Date().toISOString()
        };

        try {
            const { error } = await supabase.from('tenants')
                .update(updateData)
                .eq('id', tenantId);

            if (error) throw error;
            
            this.success.set('Configuración de la empresa guardada correctamente');
            await this.loadSettings(); 
        } catch (e: any) {
            this.error.set(e.message);
        } finally {
            this.saving.set(false);
        }
    }

    // --- BRANCHES MANAGEMENT ---
    async addBranch() {
        const payload = this.newBranch();
        if (!payload.name) {
            this.error.set('El nombre de la sucursal es obligatorio.');
            return;
        }

        this.savingBranch.set(true);
        const supabase = this.auth.getSupabaseClient();
        const tenantId = this.tenantService.getTenantId();

        try {
            const { error } = await supabase.from('branches').insert([{
                name: payload.name,
                address: payload.address,
                is_active: payload.is_active,
                tenant_id: tenantId
            }]);

            if (error) throw error;
            
            this.success.set('Sucursal agregada con éxito');
            this.newBranch.set({ name: '', address: '', is_active: true });
            await this.loadSettings(); // Reload to get the new list
        } catch (e: any) {
            this.error.set(e.message);
        } finally {
            this.savingBranch.set(false);
        }
    }

    async deleteBranch(id: string) {
        if (!confirm('¿Seguro que deseas eliminar esta sucursal?')) return;
        const supabase = this.auth.getSupabaseClient();
        try {
            const { error } = await supabase.from('branches').delete().eq('id', id);
            if (error) throw error;
            this.success.set('Sucursal eliminada');
            await this.loadSettings();
        } catch (e: any) {
            this.error.set(e.message);
        }
    }

    async toggleBranchStatus(branch: any) {
        const supabase = this.auth.getSupabaseClient();
        try {
            const { error } = await supabase.from('branches')
                .update({ is_active: !branch.is_active })
                .eq('id', branch.id);
            if (error) throw error;
            await this.loadSettings();
        } catch (e: any) {
            this.error.set(e.message);
        }
    }
}
