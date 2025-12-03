import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { UserProfile } from '@app/features/authentication/domain/entities/user.entity';

@Component({
    selector: 'app-admin-employees-page',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './admin-employees-page.html',
})
export class AdminEmployeesPage implements OnInit {
    private auth = inject(AuthService);
    employees = signal<UserProfile[]>([]);
    loading = signal(true);

    async ngOnInit() {
        await this.loadEmployees();
    }

    async loadEmployees() {
        this.loading.set(true);
        const supabase = this.auth.getSupabaseClient();
        // Employees are profiles with role 'admin' or 'staff'
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .in('role', ['admin', 'staff'])
            .order('created_at', { ascending: false });

        if (data) {
            this.employees.set(data);
        }
        this.loading.set(false);
    }
}
