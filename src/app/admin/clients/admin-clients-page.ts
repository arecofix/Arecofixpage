import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/services/auth.service';

@Component({
    selector: 'app-admin-clients-page',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './admin-clients-page.html',
})
export class AdminClientsPage implements OnInit {
    private auth = inject(AuthService);
    clients = signal<any[]>([]);
    loading = signal(true);

    async ngOnInit() {
        await this.loadClients();
    }

    async loadClients() {
        this.loading.set(true);
        const supabase = this.auth.getSupabaseClient();
        // Assuming clients are just profiles with role 'user' or we filter by something else.
        // For now, let's fetch all profiles that are not admin/staff or just all profiles.
        // The requirement says "Clientes: Nombre, Dirección, Celular, Email, DNI, estado".
        // We might need to check if we have these fields in profiles or if we need a separate clients table.
        // The plan didn't specify a separate clients table, so we'll use profiles.
        // But wait, the user might want to register clients who are not system users (no login).
        // If so, we need a clients table. The user request said "Clientes: que tenga...".
        // Usually in a repair shop, clients might not have a login.
        // I'll check if I created a clients table. I didn't in the SQL script.
        // I should probably use 'profiles' for now, or create a 'clients' table if they want offline clients.
        // Given the fields "DNI", "Dirección", "Celular", these are in profiles (or should be).
        // I'll query profiles for now.

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'user') // Assuming 'user' role is for clients
            .order('created_at', { ascending: false });

        if (data) {
            this.clients.set(data);
        }
        this.loading.set(false);
    }
}
