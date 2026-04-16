import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserProfile } from '@app/shared/interfaces/user.interface';
import { AdminUsersService } from './services/admin-users.service';
import { AdminProductService } from '@app/admin/products/services/admin-product.service';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-admin-users-page',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin-users-page.html',
})
export class AdminUsersPage implements OnInit {
    private adminUsersService = inject(AdminUsersService);
    private adminProductService = inject(AdminProductService);
    
    public users = signal<UserProfile[]>([]);
    public branches = signal<any[]>([]);
    public loading = signal<boolean>(true);

    async ngOnInit() {
        await this.loadBranches();
        await this.loadUsers();
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
            user.role = newRole as any;
        } catch (error: any) {
            alert('Error actualizando el rol: ' + error.message);
        }
    }

    async updateUserBranch(user: UserProfile, newBranchId: string) {
        try {
            await firstValueFrom(this.adminUsersService.updateBranch(user.id!, newBranchId));
            user.branch_id = newBranchId;
        } catch (error: any) {
            alert('Error actualizando la sucursal: ' + error.message);
        }
    }
}
