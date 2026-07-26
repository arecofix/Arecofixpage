import { Component, inject, OnInit, signal, computed } from '@angular/core';
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
import { CustomerService } from '@app/features/customers/application/services/customer.service';
import { Supplier } from '@app/features/customers/domain/entities/supplier.entity';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '@app/core/services/auth.service';
import { NotificationService } from '@app/core/services/notification.service';
import { TranslationService } from '@app/core/services/translation.service';

export type PeopleTab = 'clients' | 'users' | 'staff' | 'suppliers';

export interface ClientRow {
  id: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  email: string;
  phone: string;
  address?: string;
  dni?: string;
  source: 'profile' | 'repair' | 'order';
  repair_count?: number;
  order_count?: number;
  created_at?: string;
}

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
    private customerService = inject(CustomerService);
    private translationService = inject(TranslationService);
    t = this.translationService.t;

    // --- Tab State ---
    activeTab = signal<PeopleTab>('clients');

    // --- Clients Tab ---
    clients = signal<ClientRow[]>([]);
    clientsLoading = signal<boolean>(false);
    clientsSearchTerm = signal<string>('');
    clientsPageSize = signal(15);
    clientsCurrentPage = signal(1);

    filteredClients = computed(() => {
        const term = this.clientsSearchTerm().toLowerCase().trim();
        if (!term) return this.clients();
        return this.clients().filter(c =>
            (c.first_name + ' ' + c.last_name).toLowerCase().includes(term) ||
            (c.full_name || '').toLowerCase().includes(term) ||
            (c.email || '').toLowerCase().includes(term) ||
            (c.phone || '').toLowerCase().includes(term) ||
            (c.dni || '').toLowerCase().includes(term)
        );
    });

    totalClientsPages = computed(() => Math.ceil(this.filteredClients().length / this.clientsPageSize()));

    paginatedClients = computed(() => {
        const start = (this.clientsCurrentPage() - 1) * this.clientsPageSize();
        return this.filteredClients().slice(start, start + this.clientsPageSize());
    });

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

    userProfile = signal<UserProfile | null>(null);

    async ngOnInit() {
        this.authService.authState$.subscribe(state => {
            this.userProfile.set(state.profile);
        });
        await this.loadClients();
    }

    isGlobalAdmin(): boolean {
        return this.authService.isSuperAdmin() || this.userProfile()?.role === 'tenant_owner';
    }

    // ─── Tab Switch ────────────────────────────────────────────────────────
    async setTab(tab: PeopleTab) {
        if (!this.isGlobalAdmin() && tab !== 'clients') {
            this.notificationService.showError('No tienes permisos para acceder a esta pestaña.');
            return;
        }
        this.activeTab.set(tab);
        if (tab === 'clients' && this.clients().length === 0) {
            await this.loadClients();
        }
        if (tab === 'users' && this.users().length === 0) {
            await Promise.all([
                this.loadBranches(),
                this.loadUsers()
            ]);
        }
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

    // ─── Clients Tab Logic ─────────────────────────────────────────────────
    async loadClients() {
        this.clientsLoading.set(true);
        try {
            const unifiedData = await this.customerService.getUnifiedClients();
            this.clients.set(
                unifiedData.map((c: any) => ({
                    id: c.id,
                    first_name: c.first_name || '',
                    last_name: c.last_name || '',
                    full_name: c.full_name || '',
                    email: c.email || '',
                    phone: c.phone || '',
                    address: c.address,
                    dni: c.dni,
                    source: c.source as any,
                    repair_count: c.repair_count || 0,
                    order_count: c.order_count || 0,
                    created_at: c.created_at
                }))
            );
        } catch (error) {
            console.error('Error loading unified clients:', error);
        } finally {
            this.clientsLoading.set(false);
        }
    }

    downloadCSV(): void {
        const rows = this.filteredClients();
        const header = ['Nombre', 'Apellido', 'Email', 'Teléfono', 'Dirección', 'DNI', 'Fuente', 'Reparaciones', 'Pedidos'];
        const csvRows = rows.map(c => [
            this.csvEscape(c.first_name),
            this.csvEscape(c.last_name),
            this.csvEscape(c.email),
            this.csvEscape(c.phone),
            this.csvEscape(c.address ?? ''),
            this.csvEscape(c.dni ?? ''),
            this.translateSource(c.source),
            c.repair_count ?? 0,
            c.order_count ?? 0
        ]);

        const content = [
            'Arecofix - Listado de Clientes Centralizado',
            `Exportado: ${new Date().toLocaleDateString('es-AR')}`,
            '',
            header.join(';'),
            ...csvRows.map(r => r.join(';'))
        ].join('\n');

        const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `arecofix-clientes-completo-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    private translateSource(source: string): string {
        switch(source) {
            case 'profile': return 'Sistema';
            case 'repair': return 'Taller';
            case 'order': return 'Tienda';
            default: return source;
        }
    }

    private csvEscape(value: string): string {
        if (!value) return '';
        const str = String(value).replace(/"/g, '""');
        return str.includes(';') || str.includes('"') || str.includes('\n') ? `"${str}"` : str;
    }
}
