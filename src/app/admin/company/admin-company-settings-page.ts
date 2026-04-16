import { Component, inject, OnInit, signal, ChangeDetectorRef } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CompanyService } from '@app/core/services/company.service';
import { BranchService } from '@app/core/services/branch.service';
import { TenantService } from '@app/core/services/tenant.service';

@Component({
    selector: 'app-admin-company-settings-page',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './admin-company-settings-page.html',
})
export class AdminCompanySettingsPage implements OnInit {
    private tenantService = inject(TenantService);
    private companyService = inject(CompanyService);
    private branchService = inject(BranchService);
    private route = inject(ActivatedRoute);
    private cdr = inject(ChangeDetectorRef);

    form = signal({
        id: '',
        name: '',
        owner_name: '',
        tax_id: '',
        ruc: 'CUIT/CUIL', 
        address: '',
        tax_percentage: 21,
        tax_abbreviation: 'IVA',
        email: '',
        phone: '',
        location: '',
        currency: 'ARS',
        usd_rate: 1,
        logo_url: '',
    });

    loading = signal(true);
    saving = signal(false);
    error = signal<string | null>(null);
    success = signal<string | null>(null);

    // Branches Setup
    branches = signal<any[]>([]);
    newBranch = signal({ name: '', address: '', slug: '', global_markup_percentage: 0, is_active: true });
    editingBranch = signal<any | null>(null);
    tempBranch = { name: '', address: '', slug: '', global_markup_percentage: 0, is_active: true, id: '' };
    savingBranch = signal(false);

    async ngOnInit() {
        await this.loadSettings();
    }

    async loadSettings() {
        this.loading.set(true);
        const branchId = this.branchService.getCurrentBranchId();
        
        try {
            const data = await this.companyService.getSettings(branchId || undefined);
            if (data) {
                this.form.set({
                    id: data.id,
                    name: data.name,
                    owner_name: data.owner_name || '',
                    tax_id: data.tax_id || '',
                    ruc: data.tax_id_name || 'CUIT/CUIL',
                    address: data.location || '',
                    tax_percentage: data.tax_percentage || 21,
                    tax_abbreviation: data.tax_abbreviation || 'IVA',
                    email: data.contact_email || '',
                    phone: data.contact_phone || '',
                    location: data.location || '',
                    currency: data.currency || 'ARS',
                    usd_rate: Number(data.usd_rate || 1),
                    logo_url: data.branding_settings?.logo_url || '',
                });
            }
            
            const branchData = await this.branchService.getAllAdminBranches();
            this.branches.set(branchData || []);
        } catch (e: any) {
            this.error.set(e.message);
        } finally {
            this.loading.set(false);
            this.cdr.markForCheck();
        }
    }

    async onFileChange(event: any) {
        const file: File = event.target.files?.[0];
        if (!file) return;
        
        // Let's keep this out for now or define a FileUploadService.
        // Actually, since I must remove supabase:
        alert('Por favor contacte al administrador para subir logos. Componente de Subida en Mantenimiento.');
    }

    async save() {
        this.saving.set(true);
        this.error.set(null);
        this.success.set(null);
        this.cdr.markForCheck();
        
        const payload = { ...this.form() };
        const tenantId = this.tenantService.getTenantId();

        const updateData: any = {
            name: payload.name,
            owner_name: payload.owner_name,
            tax_id: payload.tax_id,
            tax_id_name: payload.ruc,
            location: payload.address || payload.location,
            tax_percentage: payload.tax_percentage,
            tax_abbreviation: payload.tax_abbreviation,
            contact_email: payload.email,
            contact_phone: payload.phone,
            currency: payload.currency,
            usd_rate: payload.usd_rate,
            branding_settings: {
                logo_url: payload.logo_url,
                primary_color: '#3b82f6'
            },
            updated_at: new Date().toISOString()
        };

        try {
            const branchId = this.branchService.getCurrentBranchId();
            const updatedRows = await this.companyService.updateSettings(tenantId, updateData, branchId || undefined);
            if (!updatedRows || updatedRows.length === 0) {
                this.error.set("No se guardaron los cambios. Permisos denegados.");
            } else {
                this.success.set('Configuración guardada correctamente');
                await this.loadSettings(); 
            }
        } catch (e: any) {
            this.error.set(e.message);
        } finally {
            this.saving.set(false);
            this.cdr.markForCheck();
        }
    }

    // --- BRANCHES MANAGEMENT ---
    async addBranch() {
        const payload = this.newBranch();
        if (!payload.name) {
            this.error.set('El nombre de la sucursal es obligatorio.');
            this.cdr.markForCheck();
            return;
        }

        this.savingBranch.set(true);
        this.cdr.markForCheck();

        const slug = payload.slug || payload.name.toLowerCase().trim().replace(/\s+/g, '-');

        try {
            await this.branchService.addBranch(payload, slug);
            this.success.set('Sucursal agregada con éxito');
            this.newBranch.set({ name: '', address: '', slug: '', global_markup_percentage: 0, is_active: true });
            await this.loadSettings();
        } catch (e: any) {
            this.error.set(e.message);
        } finally {
            this.savingBranch.set(false);
            this.cdr.markForCheck();
        }
    }

    openEditBranchModal(branch: any) {
        this.tempBranch = { ...branch };
        this.editingBranch.set(branch);
        this.cdr.markForCheck();
    }

    async updateBranch() {
        const branch = this.tempBranch;
        if (!branch.id) return;

        this.savingBranch.set(true);
        this.cdr.markForCheck();

        try {
            await this.branchService.updateBranch(branch);
            this.success.set('Sucursal actualizada');
            this.editingBranch.set(null);
            await this.loadSettings();
        } catch (e: any) {
            this.error.set(e.message);
        } finally {
            this.savingBranch.set(false);
            this.cdr.markForCheck();
        }
    }

    async deleteBranch(id: string) {
        if (!confirm('¿Seguro que deseas eliminar esta sucursal?')) return;
        
        try {
            await this.branchService.deleteBranch(id);
            this.success.set('Sucursal eliminada');
            await this.loadSettings();
        } catch (e: any) {
            this.error.set(e.message);
        } finally {
            this.cdr.markForCheck();
        }
    }

    async toggleBranchStatus(branch: any) {
        try {
            await this.branchService.toggleBranchStatus(branch);
            await this.loadSettings();
        } catch (e: any) {
            this.error.set(e.message);
        } finally {
            this.cdr.markForCheck();
        }
    }
}
