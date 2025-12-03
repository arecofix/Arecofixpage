import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@app/core/services/auth.service';
import { UserProfile } from '@app/features/authentication/domain/entities/user.entity';

@Component({
    selector: 'app-admin-users-page',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin-users-page.html',
})
export class AdminUsersPage implements OnInit {
    private auth = inject(AuthService);
    users = signal<UserProfile[]>([]);
    loading = signal(true);

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

        if (data) {
            this.users.set(data);
        }
        this.loading.set(false);
    }

    async toggleRole(user: any) {
        // Simple toggle for demo purposes, ideally a modal or select
        const newRole = user.role === 'admin' ? 'user' : 'admin';
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
