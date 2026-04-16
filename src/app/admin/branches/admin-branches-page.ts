import { Component, inject, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BranchService, Branch } from '@app/core/services/branch.service';
import { TenantService } from '@app/core/services/tenant.service';

@Component({
    selector: 'app-admin-branches-page',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin-branches-page.html',
})
export class AdminBranchesPage implements OnInit {
    private branchService = inject(BranchService);
    private tenantService = inject(TenantService);
    private router = inject(Router);
    private cdr = inject(ChangeDetectorRef);

    branches = signal<Branch[]>([]);
    loading = signal(true);
    saving = signal(false);
    error = signal<string | null>(null);
    success = signal<string | null>(null);

    // Form states
    showForm = signal(false);
    isEditing = signal(false);
    currentForm = signal<Partial<Branch>>({
        name: '',
        address: '',
        slug: '',
        global_markup_percentage: 0,
        is_active: true,
        plan_id: 'basic',
        modules_config: {
            dashboard: true,
            repairs: false,
            inventory: false,
            customers: true
        }
    });

    async ngOnInit() {
        await this.loadBranches();
    }

    async loadBranches() {
        this.loading.set(true);
        try {
            const data = await this.branchService.getAllAdminBranches();
            this.branches.set(data || []);
        } catch (e: any) {
            this.error.set(e.message);
        } finally {
            this.loading.set(false);
            this.cdr.markForCheck();
        }
    }

    openCreateForm() {
        this.isEditing.set(false);
        this.currentForm.set({
            name: '',
            address: '',
            slug: '',
            global_markup_percentage: 0,
            is_active: true,
            plan_id: 'basic',
            modules_config: {
                dashboard: true,
                repairs: false,
                inventory: false,
                customers: true
            }
        });
        this.showForm.set(true);
    }

    openEditForm(branch: Branch) {
        this.isEditing.set(true);
        // Ensure modules_config exists
        const modules = branch.modules_config || {
            dashboard: true,
            repairs: branch.plan_id === 'premium',
            inventory: branch.plan_id === 'premium',
            customers: true
        };
        this.currentForm.set({ ...branch, modules_config: { ...modules } });
        this.showForm.set(true);
    }

    onPlanChange(newPlan: string) {
        const form = this.currentForm();
        if (newPlan === 'premium') {
            this.currentForm.set({
                ...form,
                plan_id: 'premium',
                modules_config: {
                    dashboard: true,
                    repairs: true,
                    inventory: true,
                    customers: true
                }
            });
        } else if (newPlan === 'basic') {
            this.currentForm.set({
                ...form,
                plan_id: 'basic',
                modules_config: {
                    dashboard: true,
                    repairs: false,
                    inventory: false,
                    customers: true
                }
            });
        }
    }

    cancelForm() {
        this.showForm.set(false);
        this.error.set(null);
    }

    async saveBranch() {
        const payload = this.currentForm();
        if (!payload.name) {
            this.error.set('El nombre de la sucursal es obligatorio.');
            return;
        }

        this.saving.set(true);
        this.error.set(null);

        const slug = payload.slug || payload.name.toLowerCase().trim().replace(/\s+/g, '-');

        try {
            if (this.isEditing() && (payload as Branch).id) {
                await this.branchService.updateBranch(payload as Branch);
                this.success.set('Sucursal actualizada con éxito');
            } else {
                await this.branchService.addBranch(payload, slug);
                this.success.set('Sucursal creada con éxito');
            }
            this.showForm.set(false);
            await this.loadBranches();
            setTimeout(() => this.success.set(null), 3000);
        } catch (e: any) {
            this.error.set(e.message);
        } finally {
            this.saving.set(false);
            this.cdr.markForCheck();
        }
    }

    async deleteBranch(id: string) {
        if (!confirm('¿Seguro que deseas eliminar esta sucursal? Esta acción no se puede deshacer.')) return;
        
        try {
            await this.branchService.deleteBranch(id);
            this.success.set('Sucursal eliminada');
            await this.loadBranches();
            setTimeout(() => this.success.set(null), 3000);
        } catch (e: any) {
            this.error.set(e.message);
        } finally {
            this.cdr.markForCheck();
        }
    }

    async toggleStatus(branch: Branch) {
        try {
            await this.branchService.toggleBranchStatus(branch);
            await this.loadBranches();
        } catch (e: any) {
            this.error.set(e.message);
        }
    }

    manageBranch(slug: string) {
        this.router.navigate([`/${slug}/admin/dashboard`]);
    }
}
