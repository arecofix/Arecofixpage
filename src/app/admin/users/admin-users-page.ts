import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@app/core/services/auth.service';
import { TenantService } from '@app/core/services/tenant.service';
import { UserProfile } from '@app/shared/interfaces/user.interface';
import { ROLES } from '@app/core/constants/roles.constants';

@Component({
    selector: 'app-admin-users-page',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin-users-page.html',
})
export class AdminUsersPage implements OnInit {
    private auth = inject(AuthService);
    private tenantService = inject(TenantService);
    public users = signal<UserProfile[]>([]);
    public branches = signal<any[]>([]);
    public loading = signal<boolean>(true);

    async ngOnInit() {
        await this.loadBranches();
        await this.loadUsers();
    }

    async loadBranches() {
        const supabase = this.auth.getSupabaseClient();
        const tenantId = this.tenantService.getTenantId();
        const { data, error } = await supabase
            .from('branches')
            .select('*')
            .eq('tenant_id', tenantId)
            .order('name');
        
        if (!error && data) {
            this.branches.set(data);
        }
    }

    async loadUsers() {
        this.loading.set(true);
        const supabase = this.auth.getSupabaseClient();
        const tenantId = this.tenantService.getTenantId();
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('tenant_id', tenantId)
            .order('created_at', { ascending: false });

        if (!error && data) {
            this.users.set(data as UserProfile[]);
        }
        this.loading.set(false);
    }

    async updateUserRole(user: UserProfile, newRole: string) {
        const supabase = this.auth.getSupabaseClient();
        const { error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', user.id);

        if (!error) {
            user.role = newRole as any;
        } else {
            alert('Error actualizando el rol: ' + error.message);
        }
    }

    async updateUserBranch(user: UserProfile, newBranchId: string) {
        const supabase = this.auth.getSupabaseClient();
        const { error } = await supabase
            .from('profiles')
            .update({ branch_id: newBranchId || null })
            .eq('id', user.id);

        if (!error) {
            user.branch_id = newBranchId;
        } else {
            alert('Error actualizando la sucursal: ' + error.message);
        }
    }
}
