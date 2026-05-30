import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserProfile, UserRole } from '@app/shared/interfaces/user.interface';
import { UserProfile as EmployeeProfile } from '@app/features/authentication/domain/entities/user.entity';
import { Branch } from '@app/shared/interfaces/branch.interface';
import { AdminUsersService } from './services/admin-users.service';
import { AdminProductService } from '@app/admin/products/services/admin-product.service';
import { EmployeeService } from '@app/features/customers/application/services/employee.service';
import { SupplierService } from '@app/features/customers/application/services/supplier.service';
import { Supplier } from '@app/features/customers/domain/entities/supplier.entity';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '@app/core/services/auth.service';
import { NotificationService } from '@app/core/services/notification.service';

export type PeopleTab = 'users' | 'staff' | 'suppliers';

@Component({
    selector: 'app-admin-users-page',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './admin-users-page.html',
})
export class AdminUsersPage implements OnInit {
    private adminUsersService = inject(AdminUsersService);
    private adminProductService = inject(AdminProductService);
    private authService = inject(AuthService);
    private notificationService = inject(NotificationService);
    private employeeService = inject(EmployeeService);
    private supplierService = inject(SupplierService);

    // --- Tab State ---
    activeTab = signal<PeopleTab>('users');

    // --- Users Tab ---
    users = signal<UserProfile[]>([]);
    branches = signal<Branch[]>([]);
    loading = signal<boolean>(true);
    selectedUserForBranch = signal<UserProfile | null>(null);
    isUpdating = signal<boolean>(false);

    // --- Staff Tab ---
    employees = signal<EmployeeProfile[]>([]);
    staffLoading = signal<boolean>(false);

    // --- Suppliers Tab ---
    suppliers = signal<Supplier[]>([]);
    suppliersLoading = signal<boolean>(false);
    isTrackingModalOpen = signal(false);
    andreaniTrackingCode = signal<string>('');
    trackingUrl = signal<string | null>(null);
    selectedSupplierIds = signal<Set<string>>(new Set());
    isMessageModalOpen = signal(false);
    bulkMessage = signal<string>('Hola {nombre}, te contacto desde Arecofix. ');

    async ngOnInit() {
        await Promise.all([
            this.loadBranches(),
            this.loadUsers(),
        ]);
    }

    // ─── Tab Switch ────────────────────────────────────────────────────────
    async setTab(tab: PeopleTab) {
        this.activeTab.set(tab);
        if (tab === 'staff' && this.employees().length === 0) {
            await this.loadEmployees();
        }
        if (tab === 'suppliers' && this.suppliers().length === 0) {
            await this.loadSuppliers();
        }
    }

    // ─── Users Tab Logic ───────────────────────────────────────────────────
    async loadBranches() {
        try {
            const data = await this.adminProductService.getBranches();
            this.branches.set(data);
        } catch (error) {
            console.error('Error loading branches', error);
        }
    }

    async loadUsers() {
        this.loading.set(true);
        try {
            const data = await firstValueFrom(this.adminUsersService.getUsers());
            this.users.set(data);
        } catch (error: unknown) {
            console.error(error instanceof Error ? error.message : 'Error desconocido');
        } finally {
            this.loading.set(false);
        }
    }

    async updateUserRole(user: UserProfile, newRole: string) {
        try {
            await firstValueFrom(this.adminUsersService.updateRole(user.id!, newRole));
            user.role = newRole as UserRole;
            this.notificationService.showSuccess(`Rol de ${user.full_name || 'usuario'} actualizado a ${newRole}`);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            this.notificationService.showError('Error actualizando el rol: ' + errorMessage);
        }
    }

    openBranchModal(user: UserProfile) {
        this.selectedUserForBranch.set(user);
    }

    async saveUserBranch(branchId: string | null) {
        const user = this.selectedUserForBranch();
        if (!user) return;
        this.isUpdating.set(true);
        try {
            await firstValueFrom(this.adminUsersService.updateBranch(user.id!, branchId || ''));
            user.branch_id = branchId || undefined;
            if (user.id === this.authService.getCurrentUser()?.id) {
                await this.authService.refreshProfile();
            }
            this.notificationService.showSuccess('Sucursal asignada con éxito');
            this.selectedUserForBranch.set(null);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            this.notificationService.showError('Error actualizando la sucursal: ' + errorMessage);
        } finally {
            this.isUpdating.set(false);
        }
    }

    getBranchName(branchId?: string): string {
        if (!branchId) return 'Sin Asignar';
        const branch = this.branches().find(b => b.id === branchId);
        return branch ? branch.name : 'Desconocida';
    }

    /** Only super_admin has truly unrestricted global access */
    hasGlobalAccess(user: UserProfile): boolean {
        return user.role === 'super_admin';
    }

    // ─── Staff Tab Logic ───────────────────────────────────────────────────
    async loadEmployees() {
        this.staffLoading.set(true);
        try {
            const data = await this.employeeService.getAll();
            this.employees.set(data);
        } catch (error) {
            console.error('Error loading employees:', error);
        } finally {
            this.staffLoading.set(false);
        }
    }

    // ─── Suppliers Tab Logic ───────────────────────────────────────────────
    async loadSuppliers() {
        this.suppliersLoading.set(true);
        try {
            const data = await this.supplierService.getAll();
            this.suppliers.set(data.sort((a, b) => a.name.localeCompare(b.name)));
        } catch (error) {
            console.error('Error loading suppliers:', error);
        } finally {
            this.suppliersLoading.set(false);
        }
    }

    openTracker() {
        this.andreaniTrackingCode.set('');
        this.trackingUrl.set(null);
        this.isTrackingModalOpen.set(true);
    }

    trackAndreani(code: string) {
        if (!code) return;
        this.andreaniTrackingCode.set(code);
        this.trackingUrl.set(`https://seguimiento.andreani.com/envio/${code}`);
    }

    toggleSupplier(id: string) {
        const s = new Set(this.selectedSupplierIds());
        if (s.has(id)) s.delete(id);
        else s.add(id);
        this.selectedSupplierIds.set(s);
    }

    toggleAll(event: Event) {
        const checked = (event.target as HTMLInputElement).checked;
        if (checked) {
            this.selectedSupplierIds.set(new Set(this.suppliers().filter(s => s.phone).map(s => s.id)));
        } else {
            this.selectedSupplierIds.set(new Set());
        }
    }

    sendBulkMessages() {
        const suppliers = this.suppliers().filter(s => this.selectedSupplierIds().has(s.id) && s.phone);
        const baseMsg = this.bulkMessage();
        let delay = 0;
        for (const supp of suppliers) {
            setTimeout(() => {
                const finalMsg = baseMsg.replace('{nombre}', supp.name || 'Proveedor');
                const cleanPhone = supp.phone!.replace(/\D/g, '');
                const phoneWithCode = cleanPhone.startsWith('54') ? cleanPhone : `549${cleanPhone}`;
                window.open(`https://wa.me/${phoneWithCode}?text=${encodeURIComponent(finalMsg)}`, '_blank');
            }, delay);
            delay += 1000;
        }
        this.isMessageModalOpen.set(false);
        this.selectedSupplierIds.set(new Set());
    }
}
