import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-admin-repairs-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-repairs-page.html',
})
export class AdminRepairsPage implements OnInit {
  private auth = inject(AuthService);
  repairs = signal<any[]>([]);
  loading = signal(true);

  async ngOnInit() {
    await this.loadRepairs();
  }

  async loadRepairs() {
    this.loading.set(true);
    const supabase = this.auth.getSupabaseClient();
    const { data, error } = await supabase
      .from('repairs')
      .select('*')
      .order('received_at', { ascending: false });

    if (data) {
      this.repairs.set(data);
    }
    this.loading.set(false);
  }

  async deleteRepair(id: string) {
    if (!confirm('¿Estás seguro de eliminar este registro de reparación?')) return;

    const supabase = this.auth.getSupabaseClient();
    const { error } = await supabase.from('repairs').delete().eq('id', id);

    if (!error) {
      await this.loadRepairs();
    } else {
      alert('Error al eliminar la reparación');
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'badge-warning';
      case 'in_progress': return 'badge-info';
      case 'completed': return 'badge-success';
      case 'delivered': return 'badge-primary';
      case 'cancelled': return 'badge-error';
      default: return 'badge-ghost';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'in_progress': return 'En Progreso';
      case 'completed': return 'Completado';
      case 'delivered': return 'Entregado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  }
}
