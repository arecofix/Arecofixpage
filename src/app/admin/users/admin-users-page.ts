import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserProfile, UserRole } from '@app/shared/interfaces/user.interface';
import { Branch } from '@app/shared/interfaces/branch.interface';
import { AdminUsersService } from './services/admin-users.service';
import { AdminProductService } from '@app/admin/products/services/admin-product.service';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '@app/core/services/auth.service';
import { NotificationService } from '@app/core/services/notification.service';

@Component({
    selector: 'app-admin-users-page',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin-users-page.html',
})
export class AdminUsersPage implements OnInit {
    private adminUsersService = inject(AdminUsersService);
    private adminProductService = inject(AdminProductService);
    private authService = inject(AuthService);
    private notificationService = inject(NotificationService);
    
    public users = signal<UserProfile[]>([]);
    public branches = signal<Branch[]>([]);
    public loading = signal<boolean>(true);
    public selectedUserForBranch = signal<UserProfile | null>(null);
    public isUpdating = signal<boolean>(false);

    async ngOnInit() {
        await Promise.all([
            this.loadBranches(),
            this.loadUsers()
        ]);
    }

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
        } catch (error) {
            console.error('Error loading users', error);
        } finally {
            this.loading.set(false);
        }
    }

    async updateUserRole(user: UserProfile, newRole: string) {
        try {
            await firstValueFrom(this.adminUsersService.updateRole(user.id!, newRole));
            user.role = newRole as UserRole;
            this.notificationService.showSuccess(`Rol de ${user.full_name || 'usuario'} actualizado a ${newRole}`);
        } catch (error: any) {
            this.notificationService.showError('Error actualizando el rol: ' + error.message);
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
            
            // If the edited user is the current user, refresh their local profile/branch
            if (user.id === this.authService.getCurrentUser()?.id) {
                await this.authService.refreshProfile();
            }
            
            this.notificationService.showSuccess('Sucursal asignada con éxito');
            this.selectedUserForBranch.set(null);
        } catch (error: any) {
            this.notificationService.showError('Error actualizando la sucursal: ' + (error.message || 'Error desconocido'));
        } finally {
            this.isUpdating.set(false);
        }
    }

    getBranchName(branchId?: string): string {
        if (!branchId) return 'Sin Asignar';
        const branch = this.branches().find(b => b.id === branchId);
        return branch ? branch.name : 'Desconocida';
    }
}
