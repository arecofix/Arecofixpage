import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { Repair } from '@app/features/repairs/domain/entities/repair.entity';

@Component({
  selector: 'app-admin-repairs-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-repairs-page.html',
})
export class AdminRepairsPage implements OnInit {
  private auth = inject(AuthService);
  repairs = signal<Repair[]>([]);
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

  getStatusColor(statusId: number): string {
    switch (statusId) {
      case 1: return 'badge-warning';
      case 2: return 'badge-info';
      case 3: return 'badge-secondary';
      case 4: return 'badge-success';
      case 5: return 'badge-success';
      case 6: return 'badge-error';
      default: return 'badge-ghost';
    }
  }

  getStatusLabel(statusId: number): string {
    switch (statusId) {
      case 1: return 'Pendiente';
      case 2: return 'En Progreso';
      case 3: return 'Esperando Repuestos';
      case 4: return 'Completado';
      case 5: return 'Entregado';
      case 6: return 'Cancelado';
      default: return 'Pendiente';
    }
  }
}
