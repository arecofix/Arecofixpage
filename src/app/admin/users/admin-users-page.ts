import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@app/core/services/auth.service';
import { UserProfile } from '@app/shared/interfaces/user.interface';
import { ROLES } from '@app/core/constants/roles.constants';

@Component({
    selector: 'app-admin-users-page',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin-users-page.html',
})
export class AdminUsersPage implements OnInit {
    private auth = inject(AuthService);
    public users = signal<UserProfile[]>([]);
    public loading = signal<boolean>(true);

    async ngOnInit() {
        await this.loadUsers();
    }

    async loadUsers() {
        this.loading.set(true);
        const supabase = this.auth.getSupabaseClient();
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            this.users.set(data as UserProfile[]);
        }
        this.loading.set(false);
    }

    async toggleRole(user: UserProfile) {
        // Toggle between ADMIN and USER for demo, or match new logic
        const newRole = user.role === ROLES.ADMIN ? ROLES.USER : ROLES.ADMIN;
        const supabase = this.auth.getSupabaseClient();
        const { error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', user.id);

        if (!error) {
            await this.loadUsers();
        }
    }
}
