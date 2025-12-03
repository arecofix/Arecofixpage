import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-admin-services-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-services-page.html',
})
export class AdminServicesPage implements OnInit {
  private auth = inject(AuthService);
  services = signal<any[]>([]);
  loading = signal(true);

  async ngOnInit() {
    await this.loadServices();
  }

  async loadServices() {
    this.loading.set(true);
    const supabase = this.auth.getSupabaseClient();
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      this.services.set(data);
    }
    this.loading.set(false);
  }

  async deleteService(id: string) {
    if (!confirm('¿Estás seguro de eliminar este servicio?')) return;

    const supabase = this.auth.getSupabaseClient();
    const { error } = await supabase.from('services').delete().eq('id', id);

    if (!error) {
      await this.loadServices();
    } else {
      alert('Error al eliminar el servicio');
    }
  }
}
